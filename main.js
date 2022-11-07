import {Button} from "./js/ui_components/button_component.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Button, {
    text: 'Дипломная работа',
    onclick: () => {
        console.log('Переход к дипломной работе... Ну почти... Не получилось')
    },
}));