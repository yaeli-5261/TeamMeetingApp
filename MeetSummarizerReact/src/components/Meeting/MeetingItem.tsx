// import { motion } from "framer-motion";
// import { MeetingDTO } from "../../models/meetingTypes";

// interface MeetingItemProps {
//   meeting: MeetingDTO;
// }

// export default function MeetingItem({ meeting }: MeetingItemProps) {
//   return (
//     <motion.div 
//       className="border border-gray-300 rounded-2xl p-6 shadow-lg flex justify-between items-center transition-all bg-white hover:bg-blue-50 hover:shadow-xl hover:scale-105 cursor-pointer"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <span className="font-semibold text-lg text-gray-800">{meeting.name}</span>
//       <span className="text-gray-600 text-sm">{new Date(meeting.date).toLocaleDateString()}</span>
//     </motion.div>
//   );
// }
// // 