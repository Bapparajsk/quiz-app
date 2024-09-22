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

interface QuestionTag {
    name: string;
}

interface CorrectAnswers {
    answer_a_correct: string; // "true" or "false"
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
}

interface Answers {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
    [key: string]: string | null; // Index signature to allow string indexing
}

interface Question {
    id: number;
    question: string;
    description: string | null;
    answers: Answers;
    multiple_correct_answers: string; // "true" or "false"
    correct_answers: CorrectAnswers;
    correct_answer: string;
    explanation: string | null;
    tip: string | null;
    tags: QuestionTag[];
    category: string;
    difficulty: string;
    idx: number;
    bgColor: "default" | "completed" | "wrong" | "correct";
    isMarked?: number;
    yourAnswer?: string;
}

function Page() {
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Question | undefined>(undefined);
    const [isDot, setIsDot] = useState<number | undefined>(undefined);
    const [yourAnswer, setYourAnswer] = useState<string | null>(null);
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

            const res = await axios.get(
                `${url}/questions?apiKey=${apiKey}&tags=${pathname}&limit=15`,

            );
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

    if (!pathname || getIcon(pathname) == null || isError) {
        return <div>
            <h1>Page not found</h1>
        </div>;
    }  // This is a fallback page for when the pathname is not found

    return (
        <div className={"w-full h-full flex items-center justify-center"}>
            <div className={"max-w-[1300px] w-full h-auto mt-32 relative mb-20"}>
                <div className={"w-auto h-auto bg-fixed mb-8 left-0 top-4 flex gap-x-5 items-start justify-center"}>
                    <Header pathname={pathname} theme={theme}/>
                </div>
                <div className={"w-full h-auto flex flex-wrap gap-3 "}>
                    {
                        isPending ? <div className={"w-full h-full flex items-center justify-center"}>
                            <h1>Loading...</h1>
                        </div> : quiz?.map((question, idx) => (
                            <QuizzerCard
                                onClick={() => {
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
                                                                    setYourAnswer(currentQuiz.answers[key]);
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
                                            setQuiz([...quiz]);
                                            setYourAnswer(null);
                                            setIsDot(undefined);
                                            setCurrentQuiz((prev) => {
                                                if (!prev) return undefined;

                                                const prevIdx = prev.idx;
                                                const nextQuestion = findNextQuestion(prevIdx);
                                                if (nextQuestion) return nextQuestion;

                                                const notCompleted = findNotCompleted();
                                                if (notCompleted) return notCompleted;

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