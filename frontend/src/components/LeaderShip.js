export default function LeaderShipTable ({loadingLeadership, leadershipList}) {
    
    return (
        <div>
            <h2>Leadership Board</h2>

            <div className="table-leadership">

                <div className="table-leadership-row">
                    <h3>Player</h3>
                    <h3>Points</h3>
                </div>

                {   loadingLeadership ? 
                        (<></>) :
                        leadershipList.map( (player, index) => (
                            <div className="table-leadership-row" key={index}>
                                <p>{player.name}</p>
                                <p>{player.points}</p>
                            </div>
                    ))
                }
            </div>
        </div>
    );
}