import { data } from 'autoprefixer';
import { kStringMaxLength } from 'buffer';
import fs from 'fs'
import path from 'path'

import {teamComposition} from '../../../pages/CreateLineup/data/index.js'

export function getTeamsFilePath(){
    const filePath = path.join(process.cwd(), 'data', 'teams.json')
    console.log(filePath)
    return filePath
}

export function updateTeams(){
    fs.writeFileSync(getTeamsFilePath(), JSON.stringify(teamComposition), (err) =>{
    if (err) throw err;
    console.log('The file was overwritten!')
})}


export function extractTeams(){
    const filePath = path.join(process.cwd(), 'data', 'teams.json')
    const fileData = fs.readFileSync(filePath)
    const data = JSON.parse(fileData)
    console.log(data)
    return data
}

export default function Index(req,res){
    const data1 = extractTeams()

    if (req.method === 'POST'){
        const {gameId} = req.body
        var exist = false
        data1.forEach(data2 => {
            if (data2.gameId === gameId){
                exist = true
            }
        })
        if (exist === true) {
            res.status(409).json({Message:`Game was setup already`})
            return
        }

        const team = {
            gameId,
            roster:[
                {
                    teamName:'',
                    athletes:[
                        {
                            position:'P',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'C',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'1B',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'2B',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'3B',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'SS',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'LF',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'CF',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'RF',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'IF',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'OF',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'SP',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'MRP',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'LRP',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'CL',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'DH',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'PH',
                            player:'',
                            id:'',
                            score:'',
                        },
                        {
                            position:'PR',
                            player:'',
                            id:'',
                            score:'',
                        },
                    ]
                    }
            ]
        }
        
        data1.push(team)

    //     res.status(201).json({
    //         Message:`Successfully created a blank roster for gameid ${gameId}`,
    //         showTeam:team
    // })
        
    fs.writeFileSync(getTeamsFilePath(), JSON.stringify(data1,"null",2))
    }
    if (req.method === 'PUT'){

        const {gameId} = req.body
        var exist = false
        data1.forEach(data2 => {
            if (data2.gameId === gameId){
                exist = true
            }
        })
        if (exist === true) {
        }
        
        fs.writeFileSync(getTeamsFilePath(), JSON.stringify(data1,"null",2))
    //     res.status(201).json({
    //         Message:`Successfully created a blank roster for gameid ${gameId}`,
    //         showTeam:team
    // })
    }
        // const {gameId, teamName, athlete} = req.body
        // const position = data1.findIndex(internal => {
        //     return internal.gameId === gameId
        // })

        // if (position>=0){
        //     const data4 = data1[position]
        //     const position1 = data4.rosters.findIndex(internal => {
        //         return internal.teamName === teamName
        //     })

        //     }
        //     if(position1>=0){
                
        //         const teamObject = {
        //             teamName,
        //             athletes:[...data1[position].rosters[position1].athletes,athlete]
        //         }

        //         data1[position].rosters.splice(position1,1,teamObject)
        //     }
        //     else{
        //         data1[position].rosters.push(teamObject)
        //     }

        //     fs.writeFileSync(getTeamsFilePath(), JSON.stringify(data1),(err) => {
        //         if (err) throw err;
        //     })
        //     res.status(204).json({Message:`Team`+ teamName + `was updated`})
        // }
        // else{
        //     res.status(404).json({Message:`Game does not exist`})
        // }

        if (req.method === 'GET'){
            const data1 = extractTeams()
            return data1
            
            // const {gameId, teamName, athlete} = req.body
            // const position = data1.findIndex(internal => {
            //     return internal.gameId === gameId
            // })
    
            // if (position>=0){
            //     const data4 = data1[position]
            //     const position1 = data4.rosters.findIndex(internal => {
            //         return internal.teamName === teamName
            //     })
    
            //     }
            //     if(position1>=0){
                    
            //         const teamObject = {
            //             teamName,
            //             athletes:[...data1[position].rosters[position1].athletes,athlete]
            //         }
    
            //         data1[position].rosters.splice(position1,1,teamObject)
            //     }
            //     else{
            //         data1[position].rosters.push(teamObject)
            //     }
    
            //     fs.writeFileSync(getTeamsFilePath(), JSON.stringify(data1),(err) => {
            //         if (err) throw err;
            //     })
            //     res.status(204).json({Message:`Team`+ teamName + `was updated`})
            // }
            // else{
            //     res.status(404).json({Message:`Game does not exist`})
            }    
    } 