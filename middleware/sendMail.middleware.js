const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
	// host: "smtp.ethereal.email",
	// port: 587,
	// secure: false, // true for 465, false for other ports
	service: "gmail",
	auth: {
		user: process.env.email, // ethereal user
		pass: process.env.pass, // ethereal password
	},
});

module.exports.sendMail = async function paginateResult(email, token, option) {
	//higer order function
	let msg = "";
	if (option === 1) {
		msg = {
			from: process.env.email, // sender address
			to: email, // list of receivers
			subject: "Hello ✔", // Subject line
			text: "Hello world", // plain text body
			html: `<h1>Hello world </h1> 
			<br/>
			<p>Thay đổi mật khẩu tại đây</p>
			<a> ${token}</a>
			 `, // html body
		};
	}

	try {
		await transporter.sendMail(msg, (err, info) => {
			if (err) console.log(err);
			else console.log("thanh cong");
		});
		return;
	} catch (err) {
		return err;
	}
	// send mail with defined transport object
};
