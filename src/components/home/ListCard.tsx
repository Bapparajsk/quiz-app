"use client";

import React, {useEffect, useState} from 'react';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import {getIcon} from "@/lib/iconUtils";
import {useTheme} from "@/context/ThemeContext";

const ListCard = ({data} : {data: [{id: string, name: string}]}) => {
    const [cardData, setCardData] = useState<{title : string, link: string, image: string}[] | undefined>(undefined);
    const {theme} = useTheme();

    useEffect(() => {
        if (data) {
            const map = data
                .filter((item) => item.name !== "Undefined")
                .map((item) => ({
                    title: item.name,
                    link: `/test/${item.name.toLowerCase()}`,
                    image: getIcon(item.name.toLowerCase(), theme) || ""
                }));
            setCardData(map);
        }

        return () => {
            setCardData(undefined);
        }
    }, [data, theme]);

    return (
        <div className="max-w-5xl mx-auto px-8">
            {cardData && <HoverEffect items={cardData}/>}
        </div>
    );
};


export default ListCard;