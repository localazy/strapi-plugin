// // const StrapIO = (strapi, options) => {
// //   const io = require("socket.io")(strapi.server.httpServer, options);

// //   // loading middleware ordered
// //   io.use(handshake);
// //   io.use(subscribe);

// //   // debugging
// //   if(process.env.DEBUG == "strapio" || process.env.DEBUG == "*") {
// //     io.on("connection", (socket) => {
// //       console.debug("Connected Socket:", socket.id);
// //       socket.on("disconnecting", (reason) => {
// //         console.debug("Socket Disconnect:", socket.id, socket.rooms);
// //       });
// //     });
// //   }

// //   return {
// //     emit: emit(getUpServices(strapi), io),
// //     emitRaw: (room, event, data) => io.sockets.in(room).emit(event, data),
// //   };
// // };

// // module.exports = StrapIO;

// declare function StrapIO(strapi: any, options?: any): {
//   emit: (getUpServices: any, io: any) => any;
//   emitRaw: (room: string, event: string, data: any) => void;
// };

// declare module 'strapio' {
//   export default StrapIO;
// }
