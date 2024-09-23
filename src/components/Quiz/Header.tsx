"use client";

import {Modal, ModalContent, ModalHeader, ModalFooter, Button, useDisclosure, Card, CardBody, Image, Link} from "@nextui-org/react";
import {getIcon} from "@/lib/iconUtils";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import {useRouter} from "next/navigation";

export const Header = ({
    pathname,
    theme,
    totalSolved,
    endQuiz,
    totalProblems,
}: {
    pathname: string;
    theme: string;
    totalSolved: number;
    endQuiz: () => void;
    totalProblems: number;
}) => {
    const router = useRouter();
    const {isOpen, onOpen, onClose} = useDisclosure();

    function calculatePercentage(part: number, total: number) {
        if (total === 0) {
            return 0; // To avoid division by zero
        }
        return (part / total) * 100;
    }

    return (
        <>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[630px] gap-4"
                shadow="sm"
            >
                <CardBody className={"flex-row flex-wrap"}>
                    <div
                        className="flex flex-col items-start justify-center gap-4"
                    >
                        <div
                            className="w-auto h-auto flex flex-col items-center justify-start">
                            <Image
                                alt="Album cover"
                                className="object-cover scale-90"
                                height={100}
                                src={getIcon(pathname) || ""}
                                width="100"
                            />
                            <h1 className={"text-4xl"}>{pathname}</h1>
                        </div>
                        <div className="max-w-[300px]">
                            <h3>{pathname}</h3>
                            <p className="text-sm text-gray-500 text-wrap">
                                Lorem ipsum dolor sit amet, consectetur adipisicing
                                elit. Aperiam, voluptatibus.
                            </p>
                            <Link className={"cursor-pointer"}>More Information</Link>
                        </div>
                    </div>
                    <div className="w-auto flex flex-col justify-between items-center">
                        <AnimatedCircularProgressBar
                            max={totalProblems}
                            min={0}
                            value={calculatePercentage(totalSolved, totalProblems)}
                            gaugePrimaryColor="rgb(79 70 229)"
                            gaugeSecondaryColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                            valueText={`${totalSolved}/${totalProblems}`}
                        />
                        <div className={"flex gap-x-3"}>
                            <Button color={"danger"} variant={"flat"} onPress={onOpen}>
                                Exit
                            </Button>
                            <Button color={"primary"} variant={"shadow"} onPress={endQuiz}>
                                End Quiz
                            </Button>
                        </div>
                    </div>

                </CardBody>
            </Card>
            <Modal
                size={"lg"}
                isOpen={isOpen}
                onClose={onClose}
                backdrop={"blur"}
                hideCloseButton
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Are you sure you want to exit?</ModalHeader>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => {
                                    router.push("/");
                                    onClose();
                                }}>
                                    Exit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};