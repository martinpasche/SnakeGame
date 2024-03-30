import GridCell from "./GridCell.js";



export default function BoardGrid ({cells}) {

    return (
        <div className="game-grid">
            {cells.map( (value, index) => (
                <GridCell key={index}  index={index} value={value}/>
            ))}

        </div>
    );
}