import React, {FC} from "react";

const Card: FC<{
    id: string;
    content: string;
    onClick: () => void;
    additionalCn: string;
}> = ({ id, content, onClick, additionalCn }) => (
    <div
        key={id+content}
        className={`p-4 text-lg font-bold cursor-pointer rounded transition duration-300 ${additionalCn}`}
        onClick={onClick}
    >
        {content}
    </div>)


export default Card;
