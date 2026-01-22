import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Target, Zap, Shield, Users, BookOpen, Award } from "lucide-react";

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax for section
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const features = [
    {
      icon: <Target className="w-10 h-10" />,
      title: "Personalized Matching",
      description:
        "Our AI-powered algorithm matches you with mentors based on your goals, interests, and career aspirations.",
      color: "from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Real-Time Communication",
      description:
        "Connect instantly with mentors through chat, video calls, and scheduled sessions for seamless learning.",
      color: "from-yellow-300 to-orange-300 dark:from-yellow-500 dark:to-orange-500",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Verified Professionals",
      description:
        "All mentors are thoroughly vetted industry experts with proven track records in their fields.",
      color: "from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Network",
      description:
        "Join a vibrant community of learners and professionals sharing knowledge and opportunities.",
      color: "from-green-300 to-emerald-300 dark:from-green-500 dark:to-emerald-500",
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Resource Library",
      description:
        "Access curated learning materials, interview prep guides, and career development resources.",
      color: "from-rose-300 to-pink-300 dark:from-rose-500 dark:to-pink-500",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Placement Support",
      description:
        "Get dedicated support throughout your job search with resume reviews and mock interviews.",
      color: "from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500",
    },
  ];

  return (
    <section id="features" ref={ref} className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* ANIMATION: Moving Gradient Background */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 dark:from-purple-600/20 dark:to-indigo-600/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header with Reveal Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="inline-block bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 px-12 py-4 rounded-full shadow-xl border-2 border-gray-900 dark:border-gray-100"
          >
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              CORE FEATURES WE OFFER
            </h2>
          </motion.div>
        </motion.div>

        {/* ANIMATION: Staggered Card Reveal with 3D Tilt */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="flex gap-6 items-start group cursor-pointer"
            >
              {/* Icon with Glow Effect */}
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 0.3 }}
                className={`relative flex-shrink-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-3xl shadow-lg flex items-center justify-center border-2 border-gray-900 dark:border-gray-100`}
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                />
                <div className="text-gray-900 dark:text-gray-100 relative z-10">{feature.icon}</div>
              </motion.div>

              {/* Content Card */}
              <div className="flex-1 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-3xl shadow-lg border-2 border-gray-900 dark:border-gray-100 relative overflow-hidden">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                
                {/* Hover Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
