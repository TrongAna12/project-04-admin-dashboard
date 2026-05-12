"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DATA = [
  { id: 1, title: "Đơn hàng mới #101", time: "2 phút trước", read: false },
  { id: 2, title: "Hệ thống đã cập nhật", time: "1 giờ trước", read: true },
  { id: 3, title: "Sản phẩm 'iPhone' đã hết hàng", time: "3 giờ trước", read: false },
];

export default function NotificationsPage() {
  const [list, setList] = useState(MOCK_DATA);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header đơn giản */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <p className="text-sm text-muted-foreground">Xem các cập nhật mới nhất</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setList(list.map(i => ({...i, read: true})))}>
          Đọc tất cả
        </Button>
      </div>

      {/* Danh sách thông báo */}
      <Card className="divide-y overflow-hidden border-slate-200">
        {list.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "flex items-center justify-between p-4 transition-colors",
              !item.read ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-slate-50"
            )}
          >
            <div className="flex gap-4 items-center">
              {/* Chấm tròn báo hiệu chưa đọc */}
              <div className={cn(
                "h-2 w-2 rounded-full",
                !item.read ? "bg-blue-600" : "bg-transparent"
              )} />
              
              <div>
                <p className={cn("text-sm", !item.read ? "font-bold" : "font-medium")}>
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>

            {/* Nút xóa nhanh */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-red-500"
              onClick={() => setList(list.filter(i => i.id !== item.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {list.length === 0 && (
          <div className="p-10 text-center text-slate-400 text-sm">
            Không còn thông báo nào.
          </div>
        )}
      </Card>
    </div>
  );
}