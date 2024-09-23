"use client";
import React, {useEffect, useState} from 'react';
import {usePathname} from "next/navigation";
import {getIcon} from "@/lib/iconUtils";
import {useTheme} from "@/context/ThemeContext";
import {QuizzerCard} from "@/components/Quiz/QuizzerCard";
import {Header} from "@/components/Quiz/Header";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/navigation";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Chip
} from "@nextui-org/react";
import {Question} from "@/app/test/[name]/text";

function Page() {
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Question | undefined>(undefined);
    const [isDot, setIsDot] = useState<number | undefined>(undefined);
    const [yourAnswer, setYourAnswer] = useState<string | null>(null);
    const [totalSolved, setTotalSolved] = useState<number>(0);
    const [endSession, setEndSession] = useState<boolean>(false);
    const pathname = usePathname().split("/").pop();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {theme} = useTheme();
    const router = useRouter();

    const { isError, isPending } = useQuery({
        queryKey: ["questions", pathname],
        queryFn: async () => {
            const url = process.env.NEXT_PUBLIC_QUIZ_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_QUIZ_API_KEY;

            if (!url || !apiKey) {
                throw new Error("API URL or API Key is missing");
            }

            const res = await axios.get(`${url}/questions?apiKey=${apiKey}&tags=${pathname}&limit=15`);
            const data = res.data.map((quiz: Question, idx: number) => ({ ...quiz, idx, bgColor: "default" })) as Question[];
            setQuiz(data);
            return data;
        },
        enabled: quiz.length === 0,
    }); // This is a query to fetch the questions from the API

    useEffect(() => {

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener("popstate", handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleUnload);
            setQuiz([]);
            setCurrentQuiz(undefined);
            setTotalSolved(0);
            setIsDot(undefined);
            setYourAnswer(null);
            setEndSession(false);
        };
    }, []); // This effect is used to show a confirmation dialog when the user tries to leave the page

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
        event.returnValue = ''; // Required for showing the confirmation dialog in some browsers
    } // This function is used to show a confirmation dialog when the user tries to leave the page

    function handleUnload(event: PopStateEvent){
        const confirmation = window.confirm("Are you sure you want to leave this page?");
        if (!confirmation) {
            event.preventDefault();
            return;
        }
        router.back();
    } // This function is used to show a confirmation dialog when the user tries to leave the page

    function findNotCompleted() {
        for (let i = 0; i < quiz.length; i++) {
            if (quiz[i].bgColor === "default") {
                return quiz[i];
            }
        }
        return null;
    } // This function is used to find the next question that is not completed

    function findNextQuestion(prevIdx: number) {
        for (let i = prevIdx + 1; i < quiz.length; i++) {
            if (quiz[i].bgColor === "default") {
                return quiz[i];
            }
        }
        return null;
    } // This function is used to find the next question that is not completed

    function result(){
        if (endSession) return;
        let score = 0;
        const newQuiz = quiz.map((question) => {
            const { correct_answers, yourAnswer } = question as Question;

            if (yourAnswer === undefined) {
                question.bgColor = "wrong";
                return question;
            }

            let isCorrect = false;

            Object.keys(correct_answers).forEach((key) => {
                if (correct_answers[key] === "true" && (yourAnswer + "_correct") === key) {
                    isCorrect = true;
                }
            });

            if (isCorrect) {
                question.bgColor = "correct";
                score++;
            } else {
                question.bgColor = "wrong";
            }

            return question;
        });

        setQuiz(newQuiz as Question[]);
        setTotalSolved(score);
    } // This function is used to calculate the score of the user


    if (!pathname || getIcon(pathname) == null || isError) {
        return <div>
            <h1>Page not found</h1>
        </div>;
    }  // This is a fallback page for when the pathname is not found

    return (
        <div className={"w-full h-full flex items-center justify-center"}>
            <div className={"max-w-[1300px] w-full h-auto mt-32 relative mb-20"}>
                <div className={"w-auto h-auto bg-fixed mb-8 left-0 top-4 flex gap-x-5 items-start justify-center"}>
                    <Header
                        endQuiz={() => {
                            setEndSession(true);
                            result();
                        }}
                        totalSolved={totalSolved}
                        pathname={pathname}
                        theme={theme}
                        totalProblems={quiz.length}
                    />
                </div>
                <div className={"w-full h-auto flex flex-wrap gap-3 "}>
                    {
                        isPending ? <div className={"w-full h-full flex items-center justify-center"}>
                            <h1>Loading...</h1>
                        </div> : quiz?.map((question, idx) => (
                            <QuizzerCard
                                onClick={() => {
                                    if (endSession) return;
                                    setCurrentQuiz(() => ({...question, idx: idx}));
                                    onOpen();
                                }}
                                key={idx}
                                name={question.question.substring(0, 33) + "..."}
                                icon={getIcon(pathname) || ""}
                                bgColor={question.bgColor}
                                yourAnswer={question.yourAnswer}
                            />
                        ))
                    }
                </div>
                <Modal
                    size={"2xl"}
                    backdrop={"blur"}
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        setIsDot(undefined);
                    }}
                    isDismissable={false}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    {
                                        currentQuiz && <>
                                            {currentQuiz.category && <h1><span
                                                className={"text-xl text-blue-600 mr-2 font-mono"}>Category</span>{currentQuiz.category}
                                            </h1>}
                                            <h1><span className={"text-2xl text-blue-600 mr-2 font-mono"}>No.{currentQuiz.idx + 1}:</span>{currentQuiz.question}</h1>
                                        </>
                                    }
                                </ModalHeader>
                                <ModalBody>
                                    {
                                        currentQuiz && <>
                                            <h1>Answers:</h1>
                                            <div className="w-full flex flex-col gap-y-3">
                                                {
                                                    Object.keys(currentQuiz.answers).map((key, idx) => {
                                                        if (!currentQuiz.answers[key]) return null;
                                                        return (
                                                            <Chip
                                                                className={"h-auto py-2 text-wrap cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out"}
                                                                key={idx}
                                                                size={"lg"}
                                                                radius={"lg"}
                                                                color={"primary"}
                                                                onClick={() => {
                                                                    setIsDot(idx);
                                                                    setYourAnswer(key);
                                                                }}
                                                                variant={currentQuiz.isMarked === idx ? "dot" : isDot === idx ? "dot" : "flat"}
                                                            >
                                                                {currentQuiz.answers[key]}
                                                            </Chip>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            setCurrentQuiz((prev) => {
                                                if (prev && prev.idx > 0) {
                                                    return quiz[prev.idx - 1];
                                                }
                                                return prev;
                                            })
                                        }}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setCurrentQuiz((prev) => {
                                                if (prev && prev.idx < quiz.length - 1) {
                                                    console.log(quiz[prev.idx + 1]);
                                                    return quiz[prev.idx + 1];
                                                }
                                                return prev;
                                            })
                                        }}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        color="success"
                                        onPress={() => {
                                            quiz[currentQuiz?.idx as number].bgColor = "completed";
                                            quiz[currentQuiz?.idx as number].isMarked = isDot;
                                            quiz[currentQuiz?.idx as number].yourAnswer = yourAnswer || undefined;
                                            setYourAnswer(null);
                                            setIsDot(undefined);
                                            setTotalSolved((prev) => prev + 1);
                                            setCurrentQuiz((prev) => {
                                                if (!prev) return undefined;

                                                const prevIdx = prev.idx;
                                                const nextQuestion = findNextQuestion(prevIdx);
                                                if (nextQuestion) return nextQuestion;

                                                const notCompleted = findNotCompleted();
                                                if (notCompleted) return notCompleted;

                                                setQuiz([...quiz]);
                                                onClose();
                                                return undefined;
                                            });
                                        }}
                                    >
                                        Submit
                                    </Button>

                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default Page;