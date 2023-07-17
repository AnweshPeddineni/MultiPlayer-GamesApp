import "bootstrap/dist/css/bootstrap.css";

interface SquareProps {
    value: any;
    onSquareClick: React.MouseEventHandler<HTMLElement>;
}

export default function Square(props: SquareProps) {
   
    return <button className="btn btn-outline-primary square" onClick={props.onSquareClick}>{props.value}</button>;
}