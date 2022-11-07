export class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...props};
    }

    render() {
        return React.createElement(
            'button',
            {
                onClick: () => this.state.onclick(),
                //href: 'https://Haxersociety.github.io/Diplom_ThreeJS',
            },
            this.state.text,
        );
    }
}