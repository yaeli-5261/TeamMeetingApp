// import { Button } from "@/components/ui/button"
import { Button } from '@mui/material'
import { Calendar, FileText, FolderOpen, Home, Link, MessageSquare, PlusCircle, Settings, Users } from 'lucide-react'
// import Link from "next/link"

export function AppSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-teal-400">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span>MeetingFiles</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-1">
          <Button >
            <Link href="/">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button>
            <Link href="/meetings">
              <MessageSquare className="h-4 w-4" />
              Meetings
            </Link>
          </Button>
          <Button >
            <Link href="/calendar">
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button >
            <Link href="/files">
              <FolderOpen className="h-4 w-4" />
              Files
            </Link>
          </Button>
          <Button >
            <Link href="/team">
              <Users className="h-4 w-4" />
              Team
            </Link>
          </Button>
        </div>
        
        <div className="mt-6">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
            Recent Files
          </div>
          <div className="space-y-1">
            <Button >
              Q1 Strategy Meeting.pdf
            </Button>
            <Button >
              Product Roadmap 2025.docx
            </Button>
            <Button >
              Team Feedback Notes.md
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t p-3">
        <Button >
          <PlusCircle className="h-4 w-4" />
          New Meeting
        </Button>
        <Button >
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  )
}