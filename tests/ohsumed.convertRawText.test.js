const { convertRawText } = require('../lib/ohsumed')

const testText = `
Cisplatin-fluorouracil interaction in a squamous cell carcinoma xenograft.
 Patients with squamous cell carcinoma of the head and neck are treated with cisplatin and fluorouracil according to a schedule based on the findings of clinical studies.
 A similar schedule showed a supra-additive effect in the treatment of xenografted human squamous cell carcinoma of the head and neck.
 We sought to ascertain whether this schedule was optimal.
 A single intraperitoneal injection of cisplatin (7.5 mg/kg) was combined with three injections of fluorouracil given during a 24-hour period (total dose, 150 or 80 mg/kg) before, during, or after cisplatin administration.
 The combined effect of cisplatin and fluorouracil on tumor growth and toxic effects was schedule dependent.
 Consideration of both toxic effects and tumor growth inhibition, as assessed by reduction of the area under the growth curve, the optimal administration interval was found to be fluorouracil given 3 days after cisplatin administration.

 Transoesophageal echocardiography improves the diagnostic value of cardiac ultrasound in patients with carcinoid heart disease.
 Transthoracic and transoesophageal cardiac echocardiography and Doppler investigations were performed in 31 consecutive patients with malignant midgut carcinoid tumours.
 The transoesophageal images allowed measurement of the thickness of the atrioventricular valve leaflets and the superficial wall layers on the cavity side of both atria.
 The mean thickness of the anterior tricuspid leaflet was significantly greater than that of the mitral valve--a difference not seen in a control group of age-matched patients without carcinoid tumours and with normal cardiac ultrasound findings.
 In addition, the edges of the tricuspid leaflets were thickened giving them a clubbed appearance.
 Tricuspid incompetence was detected transoesophageally in 71% of the patients with carcinoid compared with 57% by transthoracic investigation.
 The inner layer of the right atrial wall in the carcinoid patients was significantly thicker than that of the left atrium and that of both atria in the controls.
 Furthermore, patients with other signs of severe carcinoid heart disease had significantly thicker mean right atrial luminal wall layer than those with less or no signs of right heart disease.
 Transoesophageal cardiac ultrasound investigation improved the diagnostic accuracy and seemed to show the structural changes typical of carcinoid heart disease established by histopathological investigations.
`
async function main() {
    return await convertRawText(testText)
}

const start = Date.now()
main().then((res) => {
    console.log('⌛', Date.now() - start)
    console.log(JSON.stringify(res, null, 2))
})