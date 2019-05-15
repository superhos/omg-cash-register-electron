/**
 * parse helper
 */
// import Parse from 'parse';

export function to (promise) {
  return new Promise((resolve , reject) => {
    promise.then(data => resolve(data)).catch(err => {
      reject(err)
    })
  })
}

// export default class parseHelper {
//   static async get(table) {
//     const className = table.charAt(0).toUpperCase() + table.substring(1).toLowerCase();
//     const data = Parse.Object.extend(className);
//     const query = new Parse.Query(data);
//     query.equalTo('state', 'normal');
//     let results = await query.find();
//     results = results.map(e => ({
//       ...e,
//       ...e.attributes,
//     }));
//     return results;
//   }

//   static async search(table, params) {
//     const className = table.charAt(0).toUpperCase() + table.substring(1).toLowerCase();
//     const data = Parse.Object.extend(className);
//     const query = new Parse.Query(data);

//     query.contains(params.type, params.content);
//     query.equalTo('state', 'normal');
//     let results = await query.find();
//     results = results.map(e => ({
//       ...e,
//       ...e.attributes,
//     }));
//     return results;
//   }

//   static async add(table, data) {
//     const className = table.charAt(0).toUpperCase() + table.substring(1).toLowerCase();
//     const Cls = Parse.Object.extend(className);
//     const obj = new Cls();

//     if (!data.state) {
//       data.state = 'normal';
//     }

//     Object.keys(data).forEach((e) => {
//       obj.set(e, data[e]);
//     });


//     let result;


//     try {
//       console.log(obj);
//       result = await obj.save();
//     } catch (error) {
//       alert(`Failed to create new object, with error code: ${error.message}`);
//     }

//     return result;
//   }

//   static async save(table, data) {
//     return await parseHelper.add(table, data);
//   }

//   static async delete(table, data) {
//     data.state = 'deleted';
//     return await parseHelper.add(table, data);
//   }

//   static async deleteAll(table, data) {
//     for (let i = 0; i < data.length; i++) {
//       await parseHelper.delete(table, data[i]);
//     }
//     return true;
//   }
// }
