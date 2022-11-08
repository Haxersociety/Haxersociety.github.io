import {Button} from "./js/ui_components/button_component.js";
import {Avatar} from "./js/ui_components/avatar_component.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Avatar, {
    //path_image: 'https://sun3-12.userapi.com/s/v1/if1/ULQxhQU5jJ2FUIzWRqVVxgks_vFdhxd4uH4ziYxBrMeuw8rM0Je_O5Tt31v72l4zjsinmVz-.jpg?size=200x200&quality=96&crop=47,288,603,603&ava=1',
    path_image: 'https://img.hhcdn.ru/photo/706848506.jpeg?t=1667963979&h=jKdY6cn8-_5UWxaNOcqz7Q',
    width: '150px',
    height: '150px`',
    onclick: () => {
        console.log('Переход к дипломной работе... Ну почти... Не получилось')
    },
}));