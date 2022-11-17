// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Django management is running')
	const execShell = (cmd) =>
			new Promise((resolve, reject) => {
				cp.exec(cmd, (err, out) => {
					return resolve(out + err);
				});
			});
	let server_is_running = false;

	let c1 = vscode.commands.registerCommand('django-management.runserver', function () {
		
		let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
		server_is_running = true;
		execShell(`python ${f}\\manage.py runserver 8000`).then((val) => {
			console.log(val);
			if(!err) vscode.window.showInformationMessage('Django is running on port 8000', ['text1','text2']);
			if(err) vscode.window.showInformationMessage('Django server fault', ['text1','text2']);
		
		})
		vscode.env.openExternal('http://localhost:8000')
		
	});

	context.subscriptions.push(c1);
	const test = (val) => {
		console.log('Tests are running')
		console.log(typeof val[0])
		console.log(val[0])
		fail_re = /FAILED/g
		success_re = /OK/g

		is_failed = fail_re.test(val[0])
		is_success = success_re.test(val[0])
		console.log(is_failed)
		console.log(is_success)

		if(is_failed) vscode.window.showErrorMessage('Django tests failed')
		if(is_success) vscode.window.showInformationMessage('Django tests passed')
	
	}
	let c2 = vscode.commands.registerCommand('django-management.test', async function () {
		
		let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
		console.log(`python ${f}\\manage.py test ${f} 2>&1  `)
		cmd = await execShell(`python ${f}\\manage.py test ${f} 2>&1  `)
		console.log(cmd)
		test(cmd)
		
	});

	context.subscriptions.push(c2);
	
	let c3 = vscode.commands.registerCommand('django-management.command',  function () {
		
		let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
		execShell(`python ${f}\\manage.py help`).then(async (val) => {
			re = /(?<=    ).+/g
			matches = val.matchAll(re)
			command_list = []
			for (const match of matches) {
				command_list.push(match[0]);
			}
			const variant = await vscode.window.showQuickPick(command_list, 
				{
					matchOnDetail: true,
				})

			let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
			
			args = await vscode.window.showInputBox();

			if(args === undefined){
				args = ''
			}
			if (variant == 'runserver') server_is_running = true;
			execShell(`python ${f}\\manage.py ${variant} ${args}`).then((val) => {
				vscode.window.showInformationMessage(`Django command: \n${val}`);
			
			});
		});
		
		
	});

	context.subscriptions.push(c3);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
