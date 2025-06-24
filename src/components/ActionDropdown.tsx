
import React from 'react';
import { MoreHorizontal, Edit, Trash2, Flag, Share } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionDropdownProps {
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  isOwner,
  onEdit,
  onDelete,
  onShare,
  onReport
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isOwner && onEdit && (
          <DropdownMenuItem onClick={onEdit} className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>تعديل</span>
          </DropdownMenuItem>
        )}
        {isOwner && onDelete && (
          <DropdownMenuItem 
            onClick={onDelete} 
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف</span>
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem onClick={onShare} className="flex items-center space-x-2">
            <Share className="w-4 h-4" />
            <span>مشاركة</span>
          </DropdownMenuItem>
        )}
        {!isOwner && onReport && (
          <DropdownMenuItem onClick={onReport} className="flex items-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>إبلاغ</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
