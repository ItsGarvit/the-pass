import { motion } from "motion/react";
import { ArrowRight, Users, GraduationCap, Briefcase, BookOpen, Target, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {

  return (
    <section 
      className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-24 pb-16 relative overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center relative z-20 pointer-events-auto">
        {/* Left Side - Text */}
        <motion.div 
          className="space-y-8 relative z-10"
        >
          <div className="bg-gradient-to-br from-green-200 to-green-300 dark:from-green-600 dark:to-green-700 p-12 rounded-[3rem] shadow-xl">
            <h1 className="text-gray-900 dark:text-gray-100">
              <span className="font-bold">The Pass</span> Welcomes You
              <br />
              Your future, served on a <span className="font-bold">Silver Platter</span>
            </h1>
            <p className="mt-4 text-gray-800 dark:text-gray-200">
              The University and the Job Market are the Chefs. We are the Waiter delivering opportunities directly to your table—hot, fresh, and personalized
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="bg-white dark:bg-gray-800 px-8 py-4 rounded-full shadow-xl font-semibold flex items-center gap-3 border-2 border-gray-900 dark:border-gray-100 group"
          >
            <span className="text-gray-900 dark:text-gray-100">GET STARTED</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 text-gray-900 dark:text-gray-100" />
          </motion.button>
        </motion.div>

        {/* Right Side - Floating Cards */}
        <motion.div
          className="relative h-[400px] bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 rounded-[3rem] shadow-xl p-8 flex items-center justify-center overflow-hidden"
        >
          {/* 3D Floating Icon Cards */}
          <div className="relative w-full h-full">
            {[
              { icon: <Users className="w-7 h-7" />, color: "from-purple-400 to-indigo-500", x: "10%", y: "15%", delay: 0, rotateBase: 5 },
              { icon: <GraduationCap className="w-7 h-7" />, color: "from-amber-400 to-orange-500", x: "65%", y: "5%", delay: 0.1, rotateBase: -8 },
              { icon: <Briefcase className="w-7 h-7" />, color: "from-red-400 to-pink-500", x: "75%", y: "45%", delay: 0.2, rotateBase: 12 },
              { icon: <BookOpen className="w-7 h-7" />, color: "from-blue-400 to-indigo-500", x: "5%", y: "55%", delay: 0.3, rotateBase: -5 },
              { icon: <Target className="w-7 h-7" />, color: "from-purple-400 to-fuchsia-500", x: "55%", y: "70%", delay: 0.4, rotateBase: 10 },
              { icon: <TrendingUp className="w-7 h-7" />, color: "from-green-400 to-emerald-500", x: "25%", y: "75%", delay: 0.5, rotateBase: -12 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`absolute w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl shadow-2xl flex items-center justify-center text-white cursor-pointer`}
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, scale: 0, rotate: item.rotateBase }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -15, 0],
                  rotate: [item.rotateBase, item.rotateBase + 5, item.rotateBase],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: item.delay },
                  scale: { duration: 0.5, delay: item.delay, type: "spring" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                }}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: 0,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                {item.icon}
              </motion.div>
            ))}
            
            {/* Center Magnetic Logo */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center z-10"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0.4)",
                  "0 0 0 20px rgba(168, 85, 247, 0)",
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-bold text-3xl bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TP
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ANIMATION 3: Liquid Wave Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-8 h-12 rounded-full border-2 border-gray-800 dark:border-gray-200 flex justify-center pt-2"
          >
            <motion.div
              className="w-1.5 h-3 bg-gray-800 dark:bg-gray-200 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}