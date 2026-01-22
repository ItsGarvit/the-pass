import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, TrendingUp } from "lucide-react";

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 px-4 md:px-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm relative overflow-hidden">
      {/* ANIMATION: Floating Particles Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 dark:bg-purple-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Real-time statistics from our growing community
          </p>
        </motion.div>

        {/* ANIMATION: Animated Stats with Number Counter */}
        <div className="grid md:grid-cols-3 gap-16">
          <StatItem
            icon={<Users className="w-10 h-10" />}
            value={2547}
            label="Students Registered"
            color="blue"
            delay={0}
            isInView={isInView}
          />
          <StatItem
            icon={<GraduationCap className="w-10 h-10" />}
            value={342}
            label="Expert Mentors"
            color="purple"
            delay={0.2}
            isInView={isInView}
          />
          <StatItem
            icon={<TrendingUp className="w-10 h-10" />}
            value={1823}
            label="Successful Placements"
            color="green"
            delay={0.4}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "blue" | "purple" | "green";
  delay: number;
  isInView: boolean;
}

function StatItem({ icon, value, label, color, delay, isInView }: StatItemProps) {
  const [count, setCount] = useState(0);
  
  const colorMap = {
    blue: { 
      text: "text-blue-600 dark:text-blue-400", 
      bg: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/30"
    },
    purple: { 
      text: "text-purple-600 dark:text-purple-400", 
      bg: "from-purple-400 to-purple-600",
      glow: "shadow-purple-500/30"
    },
    green: { 
      text: "text-green-600 dark:text-green-400", 
      bg: "from-green-400 to-green-600",
      glow: "shadow-green-500/30"
    },
  };

  useEffect(() => {
    if (!isInView) return;
    
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * value));
        
        if (progress >= 1) clearInterval(timer);
      }, 16);

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="text-center"
    >
      {/* Icon Container with Gradient Border */}
      <motion.div
        className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${colorMap[color].bg} p-[3px] shadow-xl ${colorMap[color].glow}`}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
          <div className={colorMap[color].text}>{icon}</div>
        </div>
      </motion.div>
      
      {/* Animated Number */}
      <motion.div
        className={`text-5xl font-bold mb-2 ${colorMap[color].text}`}
        initial={{ scale: 1 }}
        animate={isInView ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
      >
        {count.toLocaleString()}
        <span className="text-3xl">+</span>
      </motion.div>
      
      <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
      
      {/* Animated Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className={`h-1 w-16 mx-auto mt-4 rounded-full bg-gradient-to-r ${colorMap[color].bg}`}
      />
    </motion.div>
  );
}
