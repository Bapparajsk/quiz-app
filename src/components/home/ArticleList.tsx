"use client";
import React from "react";
import {cn} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import ListCard from "@/components/home/ListCard";

export const ArticleList = ({className}:{className?: string}) => {

    const { data, isError, isPending } = useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const url = process.env.NEXT_PUBLIC_QUIZ_API_URL;
            const apikey = process.env.NEXT_PUBLIC_QUIZ_API_KEY;

            if (!url || !apikey) {
                throw new Error("API URL or API KEY not found");
            }
            const res = await axios.get(`${url}/tags?apiKey=${apikey}`);
            return res.data as [{id: string, name: string}];
        }
    });

    return (
        <div className={cn("w-full h-auto" ,className)}>
            {
                isError ? <div>Error fetching data</div> :
                    isPending ? <div>Loading...</div> :
                        <ListCard data={data}/>
            }
        </div>
    );
};