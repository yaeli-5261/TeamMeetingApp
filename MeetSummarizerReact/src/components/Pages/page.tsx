// // import { AppFooter } from "./app-footer";
// // import { AppSidebar } from "./sideBar";

import { AppFooter } from "./app-footer";
import { AppSidebar } from "./app-sidebar";


// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex flex-1">
//         <AppSidebar />
//         <main className="flex-1 p-6">
//           <h1 className="text-2xl font-semibold">Dashboard</h1>
//           <p className="text-muted-foreground mt-2">Welcome to your team meeting file management system.</p>

//           {/* Main content would go here */}
//           <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <div className="rounded-lg border bg-card p-4 shadow-sm">
//               <h3 className="font-medium">Upcoming Meetings</h3>
//             </div>
//             <div className="rounded-lg border bg-card p-4 shadow-sm">
//               <h3 className="font-medium">Recent Files</h3>
//             </div>
//             <div className="rounded-lg border bg-card p-4 shadow-sm">
//               <h3 className="font-medium">Team Activity</h3>
//             </div>
//           </div>
//         </main>
//       </div>
//       <AppFooter />
//     </div>
//   )
// }



export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your team meeting file management system.</p>

          {/* Main content would go here */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Upcoming Meetings</h3>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Recent Files</h3>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Team Activity</h3>
            </div>
          </div>
        </main>
      </div>
      <AppFooter />
    </div>
  )
}

