import shortUrl from "../Models/miniURL.model"

export default class utility {

    static checkavailablity = async (keyword: string): Promise<boolean> => {
        try {

            const find = await shortUrl.find({ keyword });
            // console.log(find)
            if (find.length || keyword.length < 4) {
                return true
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
            return true

        }
    }

    static createUrlId = (secure: boolean):() => Promise<string | Error> => {

        const ID = async (): Promise<string | Error> => {
            try {
              

                // const security = secure ? 'S' : 'NS';
                const newID = Date.now().toString(36);
                const find = await shortUrl.find({ keyword: newID })

                if (find.length) {
                    ID()
                }
                return newID;
            } catch (error) {
                return new Error('Can not create URL ID')
            }

        }
        return ID


    }


}