import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContent';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Header = () => {
  const { isLoggedin} = useContext(AppContent);
  const navigate = useNavigate();
  const controls = useAnimation();
  
  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Observer for scroll animations
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView) {
        controls.start("visible");
      }
    }
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Particles background component
  const ParticlesBackground = () => {
    return (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() * 100) - 50],
              x: [0, (Math.random() * 100) - 50],
              opacity: [0.3, 0.8, 0.3],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 overflow-hidden">
      {/* Hero Section with enhanced animations */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 p-8 md:p-12 mb-20 text-white">
        <ParticlesBackground />
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-500/30 to-pink-500/30"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bring your <motion.span 
                className="text-yellow-300 inline-block"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: ["0 0 0px rgba(255,255,0,0)", "0 0 10px rgba(255,255,0,0.5)", "0 0 0px rgba(255,255,0,0)"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >career</motion.span> to life with an exceptional resume
            </motion.h1>
            <motion.p 
              className="text-lg mb-8 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.4 }}
            >
             Turn your experience into opportunities with our award-winning resume builder. Designed by recruitment experts.            
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button 
                onClick={() => navigate(isLoggedin ? '/builder' : '/login')}
                className="bg-white text-indigo-500 hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoggedin ? 'Create my CV' : 'Get started for free'}
              </motion.button>
              <motion.button 
                onClick={() => navigate('/templates')}
                className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-8 rounded-full transition-all"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Upload my CV
              </motion.button>
            </motion.div>
            
            {/* Animated trust indicators */}
            <motion.div 
              className="mt-8 flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center"
                animate="float"
                variants={floatingVariants}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.svg 
                    key={i} 
                    className="w-5 h-5 text-yellow-300" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    custom={i}
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity
                      }
                    }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </motion.div>
              <motion.span 
                className="text-sm opacity-80"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  transition: {
                    duration: 3,
                    repeat: Infinity
                  }
                }}
              >
               +10,000 CVs created this week              
              </motion.span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img 
              src={assets.cv_example} 
              alt="CV example" 
              className="w-full max-w-md rounded-xl shadow-2xl border-8 border-white ml-20"
              initial={{ rotate: 2 }}
              animate={{
                rotate: [2, -1, 2],
                transition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                rotate: 0,
                transition: { duration: 0.5 }
              }}
            />
            {/* Animated decorative badge */}
            <motion.div 
              className="absolute -top-5 right-20 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.2,
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            >
              NEW
            </motion.div>
            
            {/* Floating elements around the CV */}
            <motion.div 
              className="absolute rounded-2xl -bottom-1 left-12 "
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: [0, 5, -5, 0],
                transition: {
                  delay: 1,
                  duration: 0.5
                }
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <img src={assets.check_icon} alt="Check" className="w-12 h-12" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section with enhanced animations */}
      <div ref={featuresRef} className="mb-20">
        <motion.h2 
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { 
            opacity: 1, 
            y: 0,
            transition: { 
              type: "spring",
              stiffness: 100,
              damping: 10
            } 
          } : {}}
        >
          Powerful tools for your success
        </motion.h2>
        
        <motion.p 
          className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 10
            } 
          } : {}}
        >
          Everything you need to create a resume that catches the attention of recruiters
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate={featuresInView ? "visible" : {}}
          variants={containerVariants}
        >
          {[
            {
              icon: assets.easy_icon,
              title: "Intuitive interface",
              desc: "Create a professional CV in 15 minutes with our step-by-step wizard",
              color: "bg-indigo-100 text-indigo-600"
            },
            {
              icon: assets.template_icon,
              title: "30+ stylish templates",
              desc: "Designs suitable for all professions, regularly updated",
              color: "bg-purple-100 text-purple-600"
            },
            {
              icon: assets.download_icon,
              title: "Optimized export",
              desc: "High-quality PDF, direct sharing or perfect printing",
              color: "bg-blue-100 text-blue-600"
            },
            {
              icon: assets.ai_icon,
              title: "Smart suggestions",
              desc: "Our AI analyzes and improves your content automatically",
              color: "bg-green-100 text-green-600"
            },
            {
              icon: assets.mobile_icon,
              title: "Mobile friendly",
              desc: "Create and edit your CV from your smartphone",
              color: "bg-yellow-100 text-yellow-600"
            },
            {
              icon: assets.privacy_icon,
              title: "Confidentiality",
              desc: "Your data remains private - we do not sell your information",
              color: "bg-red-100 text-red-600"
              
            }
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-indigo-400 flex flex-col"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
              }}
              custom={index}
            >
              <motion.div 
                className={`w-14 h-14 rounded-full ${feature.color} flex items-center justify-center mb-4`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{feature.desc}</p>
              <motion.a 
                href="#" 
                className="text-indigo-600 font-medium inline-flex items-center mt-auto"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Learn more
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section with floating animation */}
      <motion.div 
        className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-8 md:p-12 text-white mb-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating circles in background */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() * 100) - 50],
                x: [0, (Math.random() * 100) - 50],
                transition: {
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            { number: "50K+", label: "Satisfied users" },
            { number: "95%", label: "Satisfaction rate" },
            { number: "3x", label: "More interviews" },
            { number: "30s", label: " Quick registration" }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="p-4"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: index * 0.1
                  }
                }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: index * 0.2
                }}
              >
                {stat.number}
              </motion.div>
              <motion.div 
                className="text-sm opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Testimonials with enhanced animations */}
      <div 
        ref={testimonialsRef}
        className="relative overflow-hidden rounded-3xl bg-indigo-50 p-8 md:p-12 mb-20"
      >
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full transform translate-x-16 -translate-y-16"
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 8,
              repeat: Infinity
            }
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200 rounded-full transform -translate-x-24 translate-y-24 opacity-30"
          animate={{
            x: ["-20%", "-25%", "-20%"],
            y: ["20%", "25%", "20%"],
            transition: {
              duration: 10,
              repeat: Infinity
            }
          }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={testimonialsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-800 mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring",
                stiffness: 100
              } 
            } : {}}
          >
            They got results
          </motion.h2>
          
          <motion.p 
            className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.2,
                type: "spring",
                stiffness: 100
              } 
            } : {}}
          >
            Find out how our tool transformed their job search
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
          initial="hidden"
          animate={testimonialsInView ? "visible" : {}}
          variants={containerVariants}
        >
          {[
            {
              quote: "After months of no response, I got 5 interviews in the first week with my new CV!",
              name: "Mohamed K.",
              role: "Full-Stack Developer",
              avatar: assets.avatar1
            },
            {
              quote: "The easiest resume builder I've ever used. My resume now looks much more professional.",
              name: "Amira S.",
              role: "UX/UI Designer",
              avatar: assets.avatar2
            },
            {
              quote: "The AI's suggestions helped me better formulate my experiences. A real game-changer!",
              name: "Karim B.",
              role: "Project Manager",
              avatar: assets.avatar3
            },
            {
              quote: "I landed my first job thanks to a modern model that caught the recruiter's eye.",
              name: "Léa T.",
              role: "Digital marketing",
              avatar: assets.avatar4
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: index * 0.15
                  }
                }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
              }}
            >
              <div className="flex items-start mb-4">
                <motion.div 
                  className="flex-shrink-0 mr-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                </motion.div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg 
                        key={i} 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.15 + i * 0.1 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <motion.p 
                    className="text-gray-700 italic mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                  >
                    "{testimonial.quote}"
                  </motion.p>
                  <div>
                    <motion.p 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.6 }}
                    >
                      {testimonial.name}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.7 }}
                    >
                      {testimonial.role}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div 
        className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating particles */}
        <ParticlesBackground />
        
        {/* Pulsing gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-indigo-500/30 to-pink-500/30"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            transition: {
              duration: 6,
              repeat: Infinity
            }
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ready to boost your career?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.4 }}
          >
            Create your professional resume in minutes - no fees, no registration required to try
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button 
              onClick={() => navigate(isLoggedin ? '/builder' : '/register')}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl text-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(255,255,255,0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoggedin ? 'Continue my CV' : 'Start now'}
            </motion.button>
            
            <motion.button 
              onClick={() => navigate('/templates')}
              className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-8 rounded-full transition-all text-lg"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Upload my CV
            </motion.button>
          </motion.div>
          
          <motion.p 
            className="mt-4 text-sm opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.8 }}
          >
            No credit card required • Try for free
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Header;