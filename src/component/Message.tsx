import { FiMessageCircle } from "react-icons/fi"
import { FormEvent, useState } from "react"
import { motion } from 'framer-motion'

function Message() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") || "")
    const message = String(data.get("message") || "")
    try {
      if (!name.trim() || !message.trim()) {
        setErrorMsg("Please enter your name and a message.")
        setStatus("error")
        return
      }
      setErrorMsg("")
      setStatus("sending")
      const res = await fetch("https://3cvgfofkvbci3qn7uysehhurgq0kfkpk.lambda-url.us-east-1.on.aws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      })
      if (!res.ok) throw new Error("Failed to send")
      form.reset()
      setStatus("sent")
      setTimeout(() => setStatus("idle"), 2000)
    } catch (err) {
        console.log(name, message)
      console.error(err)
      setStatus("error")
      if (!errorMsg) setErrorMsg("Failed to send. Please try again.")
      setTimeout(() => setStatus("idle"), 2000)
    }
  }
  return (
    <>
    <div  
    className="max-w-md mt-10 mx-auto p-6 bg-black/40  rounded-lg shadow-lg" >
        <div className="flex items-center gap-2 mb-4">
            <FiMessageCircle size={18} className="text-cyan-300"/>
            <span className="text-cyan-300 font-semibold">Send Message Directly to me</span>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
            <motion.div whileInView={{ x: 0, opacity: 1 }} 
            initial={{ x: -120, opacity: 0 }} 
            transition={{ duration: 0.5 }} >
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full p-3 bg-slate-800/50 border border-cyan-700/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300/50 focus:ring-cyan-300 transition-all duration-200"
                />
            </motion.div>
            <motion.div whileInView={{ x: 0, opacity: 1 }} 
            initial={{ x: 120, opacity: 0 }} 
            transition={{ duration: 0.5 }} >
                <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    required
                    className="w-full p-3 bg-slate-800/50 border border-cyan-700/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300/50  focus:ring-cyan-300 transition-all duration-200 "
                />
            </motion.div>
            {status === "error" && errorMsg && (
              <div className="text-sm text-red-300">{errorMsg}</div>
            )}
            <motion.button
                whileInView={{ x: 0, opacity: 1 }} 
                initial={{ x: -120, opacity: 0 }} 
                transition={{ duration: 0.5 }} 
                type="submit"
                disabled={status === "sending"}
                className="w-full p-3 bg-cyan-700/50 text-cyan-300 border cursor-pointer border-cyan-700 rounded-md hover:bg-cyan-600/50 hover:border-cyan-600 transition-all duration-200 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : status === "error" ? "Try Again" : "Send Message"}
            </motion.button>
        </form>
    </div>
    </>
  )
}

export default Message
