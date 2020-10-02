import { Connection } from '@salesforce/command/node_modules/@salesforce/core/lib/connection';

import * as localFile2CV from '@mshanemc/plugin-helpers/dist/localFile2CV';

import request = require('request-promise-native');

const savePhotoForUserOrGroup = async ({ conn, userOrGroupId, filePath, isBanner, isGroup }: PhotoSaveInput) => {
    const options = {
        method: 'POST',
        json: true,
        headers: {
            Authorization: `Bearer ${conn.accessToken}`
        }
    };
    // save the CV
    const photoCV = await localFile2CV.file2CV(conn, filePath);

    const savePhotResult = await request({
        ...options,
        uri: `${conn.instanceUrl}/services/data/v${conn.getApiVersion()}/${isGroup ? 'chatter/groups' : 'connect/user-profiles'}/${userOrGroupId}/${
            isBanner ? 'banner-photo' : 'photo'
        }`,
        body: {
            fileId: photoCV.ContentDocumentId
        }
    });
    return savePhotResult;
};

interface PhotoSaveInput {
    conn: Connection;
    userOrGroupId: string;
    filePath: string;
    isBanner?: boolean;
    isGroup?: boolean;
}

export { savePhotoForUserOrGroup };
