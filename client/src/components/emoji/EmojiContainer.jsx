import React, { useEffect, useState } from 'react';
import { EmojiStyle, SkinTones, Theme, Categories, EmojiClickData, Emoji, SuggestionMode } from "emoji-picker-react";
import EmojiInput from './EmojiInput'

const EmojiContainer = ({inputRef, setMessage, message, setCursorPosition, cursorPosition, bioFrom}) => {
    // const [emojiList, setEmojiList] = useState([]);
    const [selectedEmoji, setSelectedEmoji] = useState("");

    const onClick = (emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.unified);
        const ref = inputRef.current;
        ref.focus();
        if(bioFrom){
            const start = message.bio.substring(0, ref.selectionStart);
            const end = message.bio.substring(ref.selectionStart);
            const text = start + emojiData.emoji + end;
            setMessage({...message, bio:text});
            setCursorPosition(start.length + emojiData.emoji.length);
        }
        else{
            const start = message.substring(0, ref.selectionStart);
            const end = message.substring(ref.selectionStart);
            const text = start + emojiData.emoji + end;
            setMessage(text);
            setCursorPosition(start.length + emojiData.emoji.length);
        }
    }

    useEffect(()=>{
        inputRef.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);

    // useEffect(()=>{
    //     setEmojiList(prev => [...prev, selectedEmoji]);
    // },[selectedEmoji]);

    return (
        // <>
        //     <>
        //         <h2>Emoji Picker React 4 Demo</h2>
        //         <div className="show-emoji">
        //             Your selected Emoji is:
        //             {emojiList.map((emoji)=>(
        //                 <Emoji unified={emoji} emojiStyle={EmojiStyle.APPLE} size={22} />
        //             ))}
        //         </div>
        //     </>

        //     <div className='emoji-container'>
        //         <EmojiInput onClick={onClick} selectedEmoji={selectedEmoji}/>
        //     </div>
        // </>

        <div className={bioFrom ? 'bio-emoji-container' : 'emoji-container'}>
            <EmojiInput onClick={onClick} selectedEmoji={selectedEmoji}/>
        </div>
    )
}

export default EmojiContainer;