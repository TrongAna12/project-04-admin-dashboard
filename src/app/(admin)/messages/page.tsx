"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/services/api";
import type { Message } from "@/types";
import { Mail, Users, Clock3 } from "lucide-react";

function MessageRow({ message }: { message: Message }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Mail className="h-4 w-4 text-blue-500" />
            {message.subject}
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message.preview}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {message.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          {message.sender}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" />
          {message.receivedAt}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { data, isLoading } = useQuery({
  queryKey: ["messages"],
  queryFn: () => getMessages(1, 20),
  staleTime: 1000 * 60 * 2,
});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Messages"
        description="Review internal messages, customer conversations and alerts."
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" size="sm">
            New message
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                Loading messages...
              </div>
            ) : (
              <div className="space-y-4">
                {data?.data.map((item) => (
                  <MessageRow key={item.id} message={item} />
                  
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Quick overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Unread messages</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{data?.data.filter((item) => item.status === "Unread").length ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Recent senders</p>
              <div className="mt-3 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                {data?.data.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>{item.sender}</span>
                    <span>{item.receivedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
