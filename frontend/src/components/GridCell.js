export default function GridCell ({index, value}){

    return (
        <div key={index} className="game-grid-cell">
            {value === 'apple' ? (
                <div className="apple"></div>
            ) : value === 'snake' ? (
                <div className="snake"></div>
            ) : (
                <div className="empty"></div>
            )}
        </div>
    );
}