"use client";
import React, {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import ListCard from "@/components/home/ListCard";

export const ArticleList = ({
    className,
    type
}:{
    className?: string
    type?: string
}) => {

    const [cardData, setCardData] = useState<{id: string, name: string}[]>([]);

    const { data, isError, isPending } = useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const url = process.env.NEXT_PUBLIC_QUIZ_API_URL;
            const apikey = process.env.NEXT_PUBLIC_QUIZ_API_KEY;

            if (!url || !apikey) {
                throw new Error("API URL or API KEY not found");
            }
            const res = await axios.get(`${url}/tags?apiKey=${apikey}`);

            setCardData(res.data as {id: string, name: string}[]);
            return res.data as {id: string, name: string}[];
        },
        enabled: cardData.length === 0
    });

    useEffect(() => {
        if (data && data.length > 0) {
            if (type) {
                setCardData(data.filter((item) => item.name.toLowerCase().includes(type.toLowerCase())));
            } else {
                setCardData(data);
            }
        }
    }, [type]);

    return (
        <div className={cn("w-full h-auto" ,className)}>
            {
                isError ? <div>Error fetching data</div> :
                    isPending ? <div>Loading...</div> :
                        <ListCard data={cardData}/>
            }
        </div>
    );
};