'use client' // Enables client-side rendering for this component

// // Import necessary dependencies
import { useState,useEffect } from "react";
import { Button } from "./ui/button";
import { Card,CardHeader,CardTitle,CardContent,CardDescription,CardFooter } from "./ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from "next/dynamic";
import { FaBirthdayCake, FaGift} from 'react-icons/fa';
import { GiBalloons } from "react-icons/gi";

// Define type for Confetti component props
type ConfettiProps = {
    width:number;
    height:number;
}

// Dynamically import Confetti component
const DynamicConfetti = dynamic(()=> import('react-confetti'),{ssr:false});

// Define color arrays for candles, balloons, and confetti
const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']   

const BirthdayWish = () => {
    // State variables
    const [candlesLit,setCandlesLit] = useState<number>(0); // Number of lit candles
    const [balloonsPoppedCount,setBalloonsPoppedCount] = useState<number>(0); // Number of popped balloons
    const [showConfetti,setShowConfetti] = useState<boolean>(false); // Whether to show confetti
    const [windowSize,setWindowSize] = useState<ConfettiProps>({width:0,height:0}); // Window size for confetti
    const [celebrating,setCelebrating] = useState<boolean>(false); // Whether celebration has started

    // Constants
    const totalCandles:number = 5; // Total number of candles
    const totalBalloons:number = 5; // Total number of balloons

    // Effect to handle window resize
    useEffect(()=>{
        const handleResize = () =>{
            setWindowSize({width:window.innerWidth,height:window.innerHeight})
        }
        handleResize();
        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize)
    },[])

    // Effect to show confetti when all candles are lit and balloons are popped
    useEffect(()=>{
        if(candlesLit===totalCandles && balloonsPoppedCount===totalBalloons){
           setShowConfetti(true);
        }
    },[candlesLit,balloonsPoppedCount])

     // Function to light a candle
     const lightCandle = (index:number) =>{
         if(index === candlesLit){
            setCandlesLit(prev =>prev+1);
         }
     }

     // Function to pop a balloon
     const popBalloon = (index:number) =>{
        if(index === balloonsPoppedCount){
           setBalloonsPoppedCount(prev =>prev+1);
        }
    }

    // Function to start celebration
    const celebrate = ()=>{
        setCelebrating(true);
        setShowConfetti(true);
        const interval = setInterval(()=>{
            setCandlesLit(prev=>{
                if(prev<totalCandles)  return prev+1;
                clearInterval(interval);
                return prev;
            })
        },500)
    }

  return (
    // Main container
    <div className="flex items-center justify-center bg-white min-h-screen">
    {/* Animated wrapper for the card */}
    <motion.div
     initial={{ scale:0.9, opacity: 0 }}
     animate={{ scale:1, opacity: 1 }}
     transition={{duration:0.5}}
    >
    {/* Birthday card */}
    <Card className="mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg border-2 border-black">
        <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-black">Happy 20 Birthday</CardTitle>
            <CardDescription className="text-2xl font-semibold text-gray-600">Maham Jabbar</CardDescription>
            <p className="text-lg text-gray-500">August 14</p>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
            <div>
                <h3 className="text-lg font-semibold text-black mb-2">Light the Candle:</h3>
                <div className="flex justify-center space-x-3">
                    {[...Array(totalCandles)].map((_,index)=>(                      
                        <AnimatePresence key={index}>
                            {(celebrating && index <=candlesLit) || (!celebrating && index < candlesLit) ? (
                                <motion.div
                                  initial = {{scale:0}}
                                  animate = {{scale:1}}
                                  exit = {{scale:0}}
                                  transition={{duration:0.5,delay:celebrating? index*0.5 : 0 }} 
                                >
                                <FaBirthdayCake
                                className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                style={{color:candleColors[index % candleColors.length]}}
                                onClick={() => lightCandle(index)}
                                />
                                </motion.div>
                            ):(
                                <FaBirthdayCake 
                                className={`h-8 w-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                onClick={() => lightCandle(index)}
                                />
                        )}
                        </AnimatePresence>
                    ))}
                </div>
            </div>
            <div>
            <h3 className="text-lg font-semibold text-black mb-2">Pop the Balloons:</h3>
            <div className="flex justify-center space-x-3">
                {[...Array(totalBalloons)].map((_,index)=>(
                    <motion.div
                    key={index}
                    initial={{scale:1}}
                    animate={{scale : index<balloonsPoppedCount ? 0:1}}
                    transition={{duration:0.3}}
                    >
                    <GiBalloons 
                    className={`w-8 h-8 cursor-pointer hover:scale-110`}
                    style={{color:index<balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length]}}
                    onClick={()=>popBalloon(index)}
                    />
                    </motion.div>
                ))}
            </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button
            className={`hover:bg-gray-800 transition-all duration-300`}
            onClick={celebrate}
            disabled={celebrating}
            >
                Celebrate! <FaGift className="ml-2 w-4 h-4" />
            </Button>
        </CardFooter>
    </Card>
    </motion.div>
    {showConfetti && (
        <DynamicConfetti 
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        colors={confettiColors}
        />
    )}
    </div>
  )
}

export default BirthdayWish
