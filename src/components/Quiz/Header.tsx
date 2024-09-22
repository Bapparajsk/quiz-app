import {Card, CardBody, Image, Link} from "@nextui-org/react";
import {getIcon} from "@/lib/iconUtils";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import React from "react";

export const Header = ({
    pathname,
    theme,
}: {
    pathname: string;
    theme: string;
}) => {
    return (
        <>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="sm"
            >
                <CardBody>
                    <div
                        className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                        <div className="relative col-span-4 md:col-span-4">
                            <Image
                                alt="Album cover"
                                className="object-cover"
                                height={200}
                                src={getIcon(pathname) || ""}
                                width="100%"
                            />
                        </div>
                        <div className="relative col-span-4 md:col-span-4">
                            <AnimatedCircularProgressBar
                                max={100}
                                min={0}
                                value={10}
                                gaugePrimaryColor="rgb(79 70 229)"
                                gaugeSecondaryColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                            />
                        </div>
                        <div className="relative col-span-6 md:col-span-4 flex flex-col ">
                            <h3>{pathname}</h3>
                            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, voluptatibus.</p>
                            <Link>More Information</Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="sm"
            >
                <CardBody>

                </CardBody>
            </Card>
        </>
    );
};