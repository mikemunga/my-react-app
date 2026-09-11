import { motion} from 'framer-motion';
const pageVariants = {
    initial : { opacity: 0, y: 15},
    animate: {opacity: 1, y:0},
    exit: {opacity:0, y: -15}
}
export function AnimatePage ({ children }) {
    return (
        <motion.div
        variants={pageVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{duration: 0.3, ease:'easeInOut'}}
        >
            {children}
        </motion.div>
    )
}