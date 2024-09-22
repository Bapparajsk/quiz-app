import {iconName} from "@/data/icons";

export const getIcon = (name: string, theme?: string): string | null => {
    if (name in iconName) {

        if (theme === "dark") {
            if(name === "ai") {
                return "/svg/openai-white.svg";
            } else if(name === ".net") {
                return "/svg/dotnet-white.svg";
            }
        }

        return iconName[name as keyof typeof iconName];
    }
    return null;
}