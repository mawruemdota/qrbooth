// Deploy as Web app: Execute as Me, access Anyone. Testing only.
// Drive folder is private. Public endpoint has a shared submission secret.
// Do not use for production or high-volume events.
const FOLDER_ID = '1B0gMb_TlZYAIWEbrt5X12Mjx4l4f1h09';
const DEFAULTS = {name:'QR Video Booth Test',duration:5,countdown:3,cooldown:5,retention:2,open:true};
function setup() {
  const p=PropertiesService.getScriptProperties();
  if(!p.getProperty('UPLOAD_KEY'))p.setProperty('UPLOAD_KEY',Utilities.getUuid()+Utilities.getUuid());
  if(!p.getProperty('SETTINGS'))p.setProperty('SETTINGS',JSON.stringify(DEFAULTS));
  Logger.log('Upload key: '+p.getProperty('UPLOAD_KEY'));
}
function doPost(e){
  try{
    const data=JSON.parse(e.parameter.payload||'{}');
    const props=PropertiesService.getScriptProperties();
    if(!props.getProperty('UPLOAD_KEY'))throw Error('Run setup() first');
    if(data.key!==props.getProperty('UPLOAD_KEY'))throw Error('Invalid upload key');
    const s=JSON.parse(props.getProperty('SETTINGS')||JSON.stringify(DEFAULTS));
    if(!s.open)throw Error('Submissions closed');
    const lock=LockService.getScriptLock();lock.waitLock(15000);
    try{
      const id=String(data.device||'').slice(0,100);
      if(!id)throw Error('Missing browser ID');
      const hashed=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,id));
      const last=Number(props.getProperty('last_'+hashed)||0);
      if(Date.now()-last<s.cooldown*60000)throw Error('Cooldown active');
      const mime=data.mime==='video/mp4'?'video/mp4':'video/webm';
      const bytes=Utilities.base64Decode(data.video||'');
      if(bytes.length<1000||bytes.length>6*1024*1024)throw Error('Video must be between 1KB and 6MB');
      const ext=mime==='video/mp4'?'mp4':'webm';
      const name='qrbooth_'+new Date().toISOString().replace(/[:.]/g,'-')+'_'+Utilities.getUuid()+'.'+ext;
      DriveApp.getFolderById(FOLDER_ID).createFile(Utilities.newBlob(bytes,mime,name)).setDescription('QR Booth test; expires '+new Date(Date.now()+s.retention*86400000).toISOString());
      props.setProperty('last_'+hashed,String(Date.now()));
      return reply({ok:true});
    }finally{lock.releaseLock()}
  }catch(err){return reply({ok:false,error:String(err.message||err)})}
}
function reply(result){const html='<script>parent.postMessage('+JSON.stringify({source:'qrbooth-upload',...result})+', "*")<\/script>';return HtmlService.createHtmlOutput(html)}
function cleanup(){
  const s=JSON.parse(PropertiesService.getScriptProperties().getProperty('SETTINGS')||JSON.stringify(DEFAULTS));
  const files=DriveApp.getFolderById(FOLDER_ID).getFiles(),cutoff=Date.now()-s.retention*86400000;
  while(files.hasNext()){const f=files.next();if(f.getDateCreated().getTime()<cutoff)f.setTrashed(true)}
}
function createCleanupTrigger(){ScriptApp.newTrigger('cleanup').timeBased().everyHours(1).create()}
