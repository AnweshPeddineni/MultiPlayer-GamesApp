
interface SquareProps {
    value: any;
    onSquareClick: React.MouseEventHandler<HTMLElement>;
}

export default function Square(props: SquareProps) {
   
    return <button className="square" onClick={props.onSquareClick}>{props.value}</button>;
}