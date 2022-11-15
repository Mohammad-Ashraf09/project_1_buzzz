import EmojiPicker, { EmojiStyle, SkinTones, Theme, Categories, EmojiClickData, Emoji, SuggestionMode } from "emoji-picker-react";

const EmojiInput = ({onClick}) => {
    return (
        <>
            <EmojiPicker onEmojiClick={onClick} autoFocusSearch={false} theme={Theme.AUTO} />
        </>
    )
}

export default EmojiInput