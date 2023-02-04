export function Background() {

    let lines = []
    for (let i = 1; i <= 9; i++)
        lines.push(`light x${i}`)

    return(
        <div className='Background'>
            {lines.map(x => <div key={x} className={x}></div>)}
        </div>
    )

}