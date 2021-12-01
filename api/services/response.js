const { firestore } = require("../../engines/cloud/firebase");

class ResponseService {
  /**
   *
   * @param {*} response
   * @param {*} fid
   * @param {*} user
   * @returns
   */
  saveAction(response, fid, user) {
    return new Promise(async (resolve, reject) => {
      const { user_id: uid, name } = user;
      if (Boolean(uid) && Boolean(name) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "missing form uid or name from data",
        });
      }
      try {
        const formCollectionRef = firestore.collection("form").doc(`${fid}`);
        const docRef = formCollectionRef.collection("responces").doc(`${uid}`);
        await docRef.set({
          ...response,
          uid: uid,
          name: name,
          time: Date.now(),
          saved: true,
        });
        resolve({
          saved: true,
        });
        return;
      } catch (error) {
        console.log("error response saveaction----->", error);
        reject(error);
        return;
      }
    });
  } //end of saveAction

  /**
   * @description
   * @param {*} fid
   * @returns
   */
  populateByFid(fid) {
    return new Promise(async (resolve, reject) => {
      if (Boolean(fid) === false) {
        return reject({
          code: "FRM_BAD_DATA_FORMAT",
          message: "missing form fid from data",
        });
      }
      try {
        const formRef = firestore.collection("form").doc(`${fid}`);
        const colRef = formRef.collection("responces");
        const sentFormRef = formRef.collection("sent_forms");
        const sentFormSnapshot = await sentFormRef.get();
        const colSnapshot = await colRef.get();
        let response = {};
        let sentForm = {};
        colSnapshot.forEach((doc) => {
          response[doc.id] = doc.data();
        });
        sentFormSnapshot.forEach((doc) => {
          sentForm[doc.id] = doc.data();
        });
        resolve({ response, sentForm });
        return;
      } catch (error) {
        console.log("error response populate by fid action----->", error);
        reject(error);
        return;
      }
    });
  }
}

module.exports = ResponseService;
