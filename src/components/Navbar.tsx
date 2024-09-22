"use client";
import {useEffect, useState} from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import {IconCodeDots} from "@tabler/icons-react";
import {ThemeToggle} from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";

export default function AppNav() {

    const [isActive, setIsActive] = useState({
        home: false,
        development: false,
        programming: false,
        technology: false
    });

    const pathname = usePathname();
    const isvalid = pathname.startsWith("/Quiz");

    useEffect(() => {
        const path = pathname.split("/")[1];
        setIsActive({
            home: path === "",
            development: path === "development",
            programming: path === "programming",
            technology: path === "technology"
        });

        return () => {
            setIsActive({
                home: false,
                development: false,
                programming: false,
                technology: false
            });
        }
    }, [pathname]);

    return (
        <Navbar
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                ],
            }}
        >
            <NavbarBrand>
                <IconCodeDots />
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className={`hidden gap-4 ${!isvalid && "sm:flex"}`} justify="center">
                <NavbarItem isActive={isActive.home}>
                    <Link color={isActive.home ? "primary" : "foreground"} href="/">
                        home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActive.development}>
                    <Link color={isActive.development ? "primary" : "foreground"} href="/development">
                        Development
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActive.programming}>
                    <Link color={isActive.programming ? "primary" : "foreground"} href="/programming">
                        Programming
                    </Link>
                </NavbarItem>
                <NavbarItem  isActive={isActive.technology}>
                    <Link color={isActive.technology ? "primary" : "foreground"} href="/technology">
                        Technology
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeToggle />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}