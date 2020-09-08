export interface Response{
    user:{
        facebookId: string,
        name: string,
        email: string,
        pseudo: string,
        avatar: string,
        hometown: string,
        decription: string,
    },
    sorties:{
        participants: [string],
        creatorId: string,
        isPublic: boolean,
        eventID: string,
        urlID: string,
    }
    error: string,
}