// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect } from "react";
// import {ScaleLoader} from "react-spinners";

// function ChatWindow() {
//     const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
//     const [loading, setLoading] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);

//     const getReply = async () => {
//         setLoading(true);
//         setNewChat(false);

//         console.log("message ", prompt, " threadId ", currThreadId);
//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 message: prompt,
//                 threadId: currThreadId
//             })
//         };

//         try {
//             const response = await fetch("http://localhost:8080/api/chat", options);
//             const res = await response.json();
//             console.log(res);
//             setReply(res.reply);
//         } catch(err) {
//             console.log(err);
//         }
//         setLoading(false);
//     }

//     //Append new chat to prevChats
//     useEffect(() => {
//         if(prompt && reply) {
//             setPrevChats(prevChats => (
//                 [...prevChats, {
//                     role: "user",
//                     content: prompt
//                 },{
//                     role: "assistant",
//                     content: reply
//                 }]
//             ));
//         }

//         setPrompt("");
//     }, [reply]);


//     const handleProfileClick = () => {
//         setIsOpen(!isOpen);
//     }

//     return (
//         <div className="chatWindow">
//             <div className="navbar">
//                 <span><img src="src/assets/logopp.svg" alt="gpt logo"  ></img> <i className="fa-solid fa-chevron-down"></i></span>
//                 <div className="userIconDiv" onClick={handleProfileClick}>
//                     <span className="userIcon"><i className="fa-solid fa-user"></i></span>
//                 </div>
//             </div>
//             {
//                 isOpen && 
//                 <div className="dropDown">
//                     <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
//                     <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
//                     <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
//                 </div>
//             }
//             <Chat></Chat>

//             <ScaleLoader color="#fff" loading={loading}>
//             </ScaleLoader>
            
//             <div className="chatInput">
//                 <div className="inputBox">
//                     <input placeholder="Ask anything"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
//                     >
                           
//                     </input>
//                     <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
//                 </div>
//                 <p className="info">
//                     Thinkr Ai can make mistakes. Check important info. See Cookie Preferences.
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default ChatWindow;


import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

import chatLogo from "./assets/lok.svg";   // or any image you want


const API_URL = import.meta.env.VITE_API_URL;


function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // typing placeholder state
    const [placeholder, setPlaceholder] = useState("Ask Thinkr AI to ");
    const variations = [
        "create a web app",
        "create a landing page",
        "design a dashboard",
        "build an ecommerce store",
    ];

    useEffect(() => {
        let index = 0;   // which phrase
        let charIndex = 0; // which character in phrase
        let currentText = "Ask Thinkr AI to ";
        let isDeleting = false;

        const typeEffect = () => {
            const prefix = "Ask Thinkr AI to ";
            const fullText = prefix + variations[index];

            if (!isDeleting) {
                // typing forward
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
                setPlaceholder(currentText);

                if (charIndex === fullText.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 1500); // pause before deleting
                    return;
                }
            } else {
                // deleting
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
                setPlaceholder(currentText);

                if (charIndex === prefix.length) {
                    isDeleting = false;
                    index = (index + 1) % variations.length;
                }
            }

            setTimeout(typeEffect, isDeleting ? 50 : 100); // speed
        };

        typeEffect();
    }, []);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {

            

            const response = await fetch(`${API_URL}/api/chat`, options);

            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    // Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>

                    <img src={chatLogo} alt="chat logo" className="chat-logo" />


                    

                    
                </span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder={placeholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    Thinkr Ai can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
