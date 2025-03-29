import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Heart, Twitter } from "lucide-react"
import Link from "next/link"

export function AppFooter() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 MeetingFiles. All rights reserved.
          </p>

          <div className="flex items-center">
            <div className="animate-pulse mx-1">
              <Heart className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-sm text-muted-foreground">Built with care</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex">
            <div className="h-8 w-px bg-border mx-4"></div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-transform hover:scale-110 duration-300"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-transform hover:scale-110 duration-300"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Link
              href="/docs"
              className="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Documentation</span>
              <ExternalLink className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 bg-[length:200%_100%] animate-gradient"></div>
    </footer>
  )
}

