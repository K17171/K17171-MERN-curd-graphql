import React, {useState} from "react";
import TextFiled from "@material-ui/core/TextField";

export const From = (props) => {
    const [todo, setTodo] = useState('');
    const handleOnChange = (event) => {
        setTodo(event.target.value);
    };
    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            props.submit(todo);
        }
    }
    return <TextFiled id="name" onKeyDown={handleKeyDown} value={todo}
                      onChange={handleOnChange} label="todo.." margin="normal" fullWidth />;
};
