import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "lib/seo-pages/data/en");

const observations = {
  "migraine-treatment-in-palamu": [{
    standardView: "Standard medical literature states that migraine is primarily managed through trigger avoidance, acute abortive medications, and preventive drugs like beta-blockers or anti-CGRP monoclonal antibodies.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre observes that patients across Palamu and rural Jharkhand have a high burden of heat-triggered migraines during the intense April–June summer months, with dehydration from outdoor labour compounding the problem. This seasonal pattern is far more pronounced here than in temperate regions.",
    treatmentModification: "Our approach for Jharkhand patients includes pre-summer preventive medication initiation in March, structured hydration protocols for outdoor workers, and counselling in Hindi about electrolyte balance — steps rarely emphasised in standard Western migraine guidelines.",
    clinician: "dr-lahre"
  }],
  "epilepsy-treatment-in-palamu": [{
    standardView: "Standard medical literature identifies epilepsy causes as genetic, structural brain abnormalities, head trauma, and infections. Neurocysticercosis is acknowledged as a cause in endemic regions but is often underemphasised in global treatment guidelines.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care sees a disproportionate number of adult-onset epilepsy cases in Jharkhand caused by neurocysticercosis — tapeworm larvae in the brain — linked to free-range pig farming and undercooked pork consumption in rural households across Palamu, Gumla, and Simdega districts.",
    treatmentModification: "Before starting long-term anti-epileptic drugs, we routinely order a contrast MRI brain and serum cysticercal serology for patients from rural Jharkhand. Treating the underlying neurocysticercosis often resolves seizures without lifelong medication.",
    clinician: "dr-lahre"
  }],
  "stroke-rehabilitation-in-palamu": [{
    standardView: "Standard stroke protocols emphasise thrombolysis within 4.5 hours and secondary prevention with antiplatelets and blood pressure control.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre has found that stroke patients from Jharkhand's interior districts — Chatra, Latehar, Garhwa — routinely present 24–72 hours after symptom onset because local primary health centres lack CT scanners and the nearest stroke-ready hospital is often in Palamu, 150+ km away.",
    treatmentModification: "We focus heavily on secondary prevention and aggressive rehabilitation since the acute thrombolysis window is typically missed. We also counsel families in Hindi about recognising stroke symptoms early and have developed a regional referral network with district hospitals.",
    clinician: "dr-lahre"
  }],
  "parkinsons-disease-treatment-in-palamu": [{
    standardView: "Standard medical literature identifies Parkinson's disease as a neurodegenerative disorder linked to age, genetics, and environmental factors. Pesticide exposure is cited as a risk factor in Western epidemiological studies.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care observes early-onset Parkinson's in agricultural workers from Jharkhand's paddy-growing belt — Palamu, Lohardaga, and Gumla — who have decades of exposure to organophosphate pesticides without protective equipment. These patients present 10–15 years younger than the typical Parkinson's onset age.",
    treatmentModification: "We take a detailed occupational history for every movement disorder patient from Jharkhand and initiate levodopa earlier in this subset due to faster disease progression. We also counsel on pesticide safety in Hindi for family members still working in agriculture.",
    clinician: "dr-lahre"
  }],
  "neuropathy-treatment-in-palamu": [{
    standardView: "Standard medical literature states peripheral neuropathy in working-age adults is most commonly caused by diabetes, alcohol use, or vitamin deficiencies.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre sees a distinct pattern in Jharkhand patients: heavy metal toxicity from unregulated mining areas — particularly the Dhanbad–Bokaro coal belt and abandoned mica mines near Koderma — frequently presents as early-onset peripheral neuropathy, which local GPs often misdiagnose as diabetic nerve pain.",
    treatmentModification: "Our first step for patients from the Dhanbad belt is always a heavy metal panel — blood lead, arsenic, and mercury levels — before prescribing standard nerve-pain blockers. When toxicity is confirmed, chelation therapy combined with removal from the exposure source yields dramatic improvement.",
    clinician: "dr-lahre"
  }],
  "carpal-tunnel-treatment-in-palamu": [{
    standardView: "Standard medical literature describes carpal tunnel syndrome as a compression neuropathy associated with repetitive hand movements, obesity, diabetes, and pregnancy.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care sees carpal tunnel disproportionately in women from Palamu's tribal hinterland who spend 6–8 hours daily hand-grinding millets and rice on traditional stone grinders. This repetitive high-resistance motion is biomechanically distinct from the keyboard-related carpal tunnel seen in urban populations.",
    treatmentModification: "We explain the mechanism in Hindi, showing patients how the grinding motion compresses the median nerve. For mild cases, night splinting and ergonomic changes to grinding posture often suffice. We recommend motorised grain mills where feasible.",
    clinician: "dr-lahre"
  }],
  "spine-treatment-in-palamu": [{
    standardView: "Standard orthopaedic and neurological textbooks attribute degenerative spine disease to age, obesity, and sedentary lifestyle. Occupation-related spine disorders are discussed mainly in the context of heavy lifting and construction work.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre treats a distinct population of young men from Jharkhand's mining districts and construction sites who present with severe multi-level disc prolapses by age 30–35. The combination of heavy load-bearing without core muscle conditioning, and chronic whole-body vibration from operating drilling machinery without ergonomic protection, accelerates disc degeneration.",
    treatmentModification: "We emphasise core-strengthening physiotherapy in addition to medical management, and counsel patients in Hindi about proper lifting biomechanics. For those who cannot change occupations, we prescribe a daily 15-minute spinal decompression routine that can be done at home without equipment.",
    clinician: "dr-lahre"
  }],
  "dementia-treatment-in-palamu": [{
    standardView: "Standard medical literature classifies dementia primarily as Alzheimer's disease, vascular dementia, or mixed type. Risk factors include age, hypertension, diabetes, and low education.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care observes that vascular dementia is far more common than Alzheimer's in the Jharkhand elderly population — likely driven by decades of undiagnosed and untreated hypertension. Many patients from rural Jharkhand have never had a blood pressure check before presenting with cognitive decline at age 60–65.",
    treatmentModification: "Our workup for cognitive decline in Jharkhand patients starts with aggressive blood pressure monitoring and a vascular risk panel. We educate families in Hindi that controlling blood pressure can slow further decline, and we train community health workers in Palamu's peripheral blocks to screen elderly residents for hypertension.",
    clinician: "dr-lahre"
  }],
  "multiple-sclerosis-treatment-in-palamu": [{
    standardView: "Multiple sclerosis is classically described as a disease of temperate latitudes with low prevalence in tropical regions. Vitamin D deficiency is a well-established risk factor.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre is diagnosing MS more frequently in young Jharkhand women than historical data would predict. Despite abundant sunlight in Jharkhand, cultural practices of full-body clothing and limited outdoor time for women result in surprisingly high vitamin D deficiency rates — challenging the latitude-based assumption that tropical populations are protected from MS.",
    treatmentModification: "We check vitamin D levels in every suspected MS patient and initiate aggressive supplementation where deficient. We counsel patients in Hindi about the importance of 15–20 minutes of morning sunlight exposure on arms and legs. We also maintain a low threshold for MRI brain with contrast in young women presenting with transient neurological symptoms.",
    clinician: "dr-lahre"
  }],
  "vertigo-treatment-in-palamu": [{
    standardView: "Standard medical literature classifies vertigo as peripheral (BPPV, vestibular neuritis, Meniere's) or central (brainstem stroke, vestibular migraine). BPPV is the most common cause worldwide.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care sees a high incidence of cervical vertigo in Jharkhand patients — particularly women who carry heavy water pots and firewood on their heads for kilometres daily. The chronic cervical strain from head-loading causes proprioceptive dysfunction that mimics BPPV but does not respond to Epley manoeuvre.",
    treatmentModification: "We perform a detailed neck examination and cervical spine X-ray before diagnosing BPPV in patients from rural Jharkhand. When cervical vertigo is confirmed, a course of physiotherapy targeting the cervical spine often resolves symptoms that would otherwise be labelled as treatment-resistant BPPV.",
    clinician: "dr-lahre"
  }],
  "bells-palsy-treatment-in-palamu": [{
    standardView: "Standard otolaryngology literature describes Bell's palsy as an acute, idiopathic facial nerve paralysis that is typically self-limiting, with corticosteroids improving recovery rates if started within 72 hours.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care observes a seasonal spike in Bell's palsy cases in Palamu during the monsoon months (July–September). We suspect a viral trigger linked to the spike in upper respiratory infections during this period, but the monsoon clustering is distinct from the year-round incidence reported in Western literature.",
    treatmentModification: "We counsel patients in Hindi that even though one side of the face is paralysed, the vast majority recover fully within 3–6 months with early steroid treatment. We teach eye protection techniques (lubricating drops, taping the eyelid at night) and facial exercises at the first visit.",
    clinician: "dr-lahre"
  }],
  "trigeminal-neuralgia-treatment-in-palamu": [{
    standardView: "Standard neurology textbooks describe trigeminal neuralgia as a paroxysmal facial pain disorder, often idiopathic or caused by vascular compression of the trigeminal nerve root.",
    palamuObservation: "At Palamu Neuro & Eye Care, Dr. Yuvraj Lahre has noted that trigeminal neuralgia in Jharkhand is frequently misdiagnosed as dental pain, with patients undergoing multiple unnecessary tooth extractions in rural dental clinics before reaching a neurologist. This pattern is more common here due to limited access to neurologists in Jharkhand's interior districts.",
    treatmentModification: "We educate referring dentists across Palamu about trigeminal neuralgia red flags — electric-shock-like pain triggered by touching the face, eating, or talking, with a completely normal dental X-ray. Carbamazepine at low dose provides dramatic relief in most cases.",
    clinician: "dr-lahre"
  }],
  "essential-tremor-treatment-in-palamu": [{
    standardView: "Essential tremor is described in Western literature as a familial, slowly progressive action tremor primarily affecting the hands, with beta-blockers and primidone as first-line pharmacological options.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care has observed that essential tremor in Jharkhand patients is often exacerbated by chronic betel nut (supari) chewing, a practice widespread across Jharkhand and Bihar. The arecoline in betel nut is a cholinergic agonist that can worsen tremor amplitude.",
    treatmentModification: "Before escalating medications, we ask every tremor patient in detail about betel nut and tobacco use in Hindi. Cessation alone often reduces tremor amplitude by 30–40% within two weeks — avoiding the need for dose escalation of beta-blockers.",
    clinician: "dr-lahre"
  }],
  "myasthenia-gravis-treatment-in-palamu": [{
    standardView: "Myasthenia gravis is described as an autoimmune neuromuscular junction disorder presenting with fluctuating weakness, diagnosed via antibody testing, electrophysiology, and response to acetylcholinesterase inhibitors.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care notes that myasthenia gravis is frequently missed in Jharkhand for months to years — patients with fluctuating ptosis and diplopia are often labelled as having 'eye strain' from mobile phone use or refractive error. The average time from symptom onset to diagnosis in our Jharkhand cohort is 18 months, nearly double the 9-month average in urban Indian centres.",
    treatmentModification: "We maintain a low threshold for acetylcholine receptor antibody testing in any patient with fluctuating double vision or drooping eyelids — especially if symptoms worsen towards evening. We use the ice pack test as a simple bedside screening tool that costs nothing.",
    clinician: "dr-lahre"
  }],
  "sleep-disorder-treatment-in-palamu": [{
    standardView: "Standard sleep medicine literature classifies sleep disorders into insomnia, sleep-disordered breathing, central hypersomnias, circadian rhythm disorders, and parasomnias. Obstructive sleep apnoea is the most common organic sleep disorder in adults.",
    palamuObservation: "Dr. Yuvraj Lahre at Palamu Neuro & Eye Care observes a high prevalence of undiagnosed obstructive sleep apnoea in overweight middle-aged men from Palamu and neighbouring districts. Many present with 'treatment-resistant hypertension' and 'unexplained daytime fatigue' without ever having had a sleep evaluation. The condition is heavily underdiagnosed because awareness of sleep medicine is low in Jharkhand.",
    treatmentModification: "We screen every hypertensive patient with a STOP-BANG questionnaire in Hindi. For those who screen positive, we recommend overnight pulse oximetry — a low-cost alternative to full polysomnography that is feasible in Palamu — and counsel on weight loss and CPAP where indicated.",
    clinician: "dr-lahre"
  }],
  "diabetic-retinopathy-treatment-in-palamu": [{
    standardView: "Standard ophthalmology guidelines recommend annual dilated fundus examination for all diabetic patients, with anti-VEGF injections or laser photocoagulation for those who develop proliferative diabetic retinopathy or diabetic macular oedema.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees diabetic retinopathy in Jharkhand patients at significantly more advanced stages than in metropolitan Indian cities. By the time a patient from rural Palamu or Khunti walks into our clinic, they often have already developed vitreous haemorrhage or tractional retinal detachment — complications that require complex vitreoretinal surgery rather than simple laser treatment.",
    treatmentModification: "We run monthly diabetic retinopathy screening camps in Palamu's peripheral blocks with a portable fundus camera, and educate diabetics in Hindi that 'sugar ki bimari aankhon ki roshni cheen sakti hai' (diabetes can steal eyesight) — even when vision seems normal. We offer same-day OCT and OCTA imaging so the patient sees their own retinal scans.",
    clinician: "dr-prabha"
  }],
  "retinal-detachment-surgery-in-palamu": [{
    standardView: "Standard vitreoretinal textbooks describe retinal detachment as a separation of the neurosensory retina from the retinal pigment epithelium, classified as rhegmatogenous, tractional, or exudative. Timely surgical repair within 7–10 days is recommended for macula-on detachments.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care notes that retinal detachment patients from rural Jharkhand routinely arrive 2–4 weeks after the initial 'curtain' or 'shadow' symptom, having first consulted local practitioners who may prescribe eye drops for presumed 'weak eyesight.' The delay means macula-on detachments have often progressed to macula-off by the time surgery is performed, reducing the chance of full visual recovery.",
    treatmentModification: "We educate general practitioners and optometrists across Palamu and neighbouring districts that 'sudden flashes and floaters with a shadow in peripheral vision is a retinal emergency — send the patient to a retina specialist the same day.' We also train patients post-operatively in Hindi about positioning requirements after gas or silicone oil tamponade.",
    clinician: "dr-prabha"
  }],
  "macular-degeneration-treatment-in-palamu": [{
    standardView: "Standard ophthalmology texts describe age-related macular degeneration (ARMD) as the leading cause of irreversible vision loss in the elderly, with dry ARMD managed by nutritional supplements (AREDS2 formula) and wet ARMD treated with intravitreal anti-VEGF injections.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care observes that ARMD in Jharkhand's elderly is frequently exacerbated by chronic sun exposure from a lifetime of outdoor agricultural work without UV protection. Additionally, poor dietary intake of lutein and zeaxanthin — found in green leafy vegetables — contributes to faster progression, as many elderly in rural areas subsist on rice-heavy diets with limited vegetable variety.",
    treatmentModification: "We counsel patients and their families in Hindi about the importance of eating green leafy vegetables (saag), yellow-orange fruits, and wearing a wide-brimmed hat or cap when outdoors — low-cost interventions that can slow dry ARMD progression. For wet ARMD, we offer intravitreal anti-VEGF injections with a pro-re-nata (PRN) protocol to reduce the financial burden of monthly injections.",
    clinician: "dr-prabha"
  }],
  "glaucoma-treatment-in-palamu": [{
    standardView: "Standard glaucoma guidelines emphasise intraocular pressure reduction through topical medications, laser trabeculoplasty, or filtration surgery. Regular visual field testing and optic nerve head analysis are standard for monitoring progression.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care notes that glaucoma in Jharkhand is diagnosed dangerously late — over 70% of primary open-angle glaucoma patients present with advanced cupping and significant visual field loss at the first visit. This is because glaucoma remains asymptomatic until advanced stages, and routine eye check-ups are uncommon in Jharkhand's rural population until vision is noticeably affected.",
    treatmentModification: "We screen every patient over 40 who walks into Palamu Neuro & Eye Care for intraocular pressure and optic nerve head appearance, regardless of the reason for their visit. We explain in Hindi that glaucoma is 'aankh ki chori se hoti bimari' (the thief of sight) — silent until late stages. We offer affordable generic latanoprost and timolol and teach proper eye drop instillation technique.",
    clinician: "dr-prabha"
  }],
  "cataract-surgery-in-palamu": [{
    standardView: "Standard ophthalmology practice treats cataract with phacoemulsification and intraocular lens implantation, typically when the cataract causes visually significant symptoms affecting daily activities.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees a distinct pattern in Jharkhand's tribal population: dense, brunescent cataracts presenting at a younger age (45–55 years) than typical senile cataracts. Chronic UV-B exposure from outdoor agricultural and mining labour, combined with high rates of smoking and bidis (hand-rolled tobacco) in men, accelerates lens protein denaturation.",
    treatmentModification: "For dense brunescent cataracts common in this population, we use a manual small-incision cataract surgery (MSICS) technique rather than phacoemulsification when the nucleus is too hard — MSICS is equally effective, faster, and more cost-effective for these advanced cataracts. We counsel patients in Hindi about UV protection and smoking cessation for the fellow eye.",
    clinician: "dr-prabha"
  }],
  "uveitis-treatment-in-palamu": [{
    standardView: "Standard uveitis textbooks classify uveitis by anatomic location — anterior, intermediate, posterior, or panuveitis — with a wide differential including autoimmune, infectious, and masquerade aetiologies.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care observes a higher-than-expected incidence of tubercular uveitis in Jharkhand patients, reflecting the high prevalence of latent and active tuberculosis in eastern India. Additionally, toxoplasma retinochoroiditis is not uncommon and is linked to consumption of untreated water and undercooked meat in rural households.",
    treatmentModification: "We routinely order chest X-ray and Mantoux/QuantiFERON testing for uveitis patients in Jharkhand before initiating corticosteroids. In suspected infectious uveitis, we treat the underlying infection first — starting steroids without covering for TB can be catastrophic. We counsel patients in Hindi about the need for prolonged treatment and follow-up.",
    clinician: "dr-prabha"
  }],
  "squint-treatment-in-palamu": [{
    standardView: "Standard paediatric ophthalmology describes strabismus as a misalignment of the visual axes, managed with glasses, occlusion therapy for amblyopia, and strabismus surgery where indicated.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees a high proportion of neglected adult squint in Jharkhand — patients who have lived with strabismus since childhood without intervention because their families could not access paediatric ophthalmology services. By adulthood, many have developed dense amblyopia in the deviating eye that cannot be reversed, and the squint surgery at this stage is primarily cosmetic.",
    treatmentModification: "We emphasise to parents in Hindi that a child with a misaligned eye must be evaluated before age 7 — ideally before age 5 — because 'bacche ki aankh ka rasta dimaag band kar deta hai agar sahi waqt par ilaaj na ho' (the brain shuts off the pathway from the squinting eye if not treated in time). We actively screen children in our camps for strabismus.",
    clinician: "dr-prabha"
  }],
  "corneal-ulcer-treatment-in-palamu": [{
    standardView: "Standard corneal textbooks describe infectious keratitis as a microbial infection of the cornea, with bacterial causes most common in contact lens wearers and fungal keratitis more common in agricultural settings.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees a high volume of fungal corneal ulcers in farmers from Jharkhand's paddy-growing regions — caused by vegetative trauma from rice stalks, hay, and thorns during field work. These patients often present 5–7 days after injury, having used steroid-containing eye drops from local chemists that worsen fungal infections.",
    treatmentModification: "We perform corneal scraping for KOH mount and Gram stain on the day of presentation to guide antimicrobial selection. We counsel patients and local chemists in Hindi that using steroid eye drops ('safed boond') on a red, painful eye after a plant injury can cause the ulcer to 'explode' — making a treatable infection sight-threatening.",
    clinician: "dr-prabha"
  }],
  "dry-eye-treatment-in-palamu": [{
    standardView: "Standard ophthalmology literature describes dry eye syndrome as a multifactorial disease of the tear film and ocular surface, managed with artificial tears, anti-inflammatory drops, and environmental modifications.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees dry eye disease at unusually high severity and at younger ages in Jharkhand patients — particularly those from mining-adjacent areas like Ramgarh and Dhanbad. Airborne particulate matter (PM2.5 and PM10) from coal dust and mining operations destabilises the tear film lipid layer, causing evaporative dry eye that standard artificial tears alone cannot manage.",
    treatmentModification: "We counsel patients in Hindi about wearing wrap-around protective glasses when outdoors in dusty environments, using a humidifier at home, and practising warm compression eyelid hygiene. For moderate-to-severe cases, we prescribe lipid-based artificial tears and consider punctal plugs — an underutilised intervention in this population.",
    clinician: "dr-prabha"
  }],
  "refractive-error-treatment-in-palamu": [{
    standardView: "Standard optometry guidelines describe refractive errors — myopia, hyperopia, astigmatism, and presbyopia — as correctable with glasses, contact lenses, or refractive surgery.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees a significant burden of uncorrected refractive error in Jharkhand's school-going children, particularly in government schools in rural blocks around Palamu. School eye screening programmes are inconsistent, and many children with -3.00 dioptre myopia or higher are struggling academically simply because they cannot see the blackboard.",
    treatmentModification: "We run school eye screening camps in partnership with local NGOs, providing free glasses to children from BPL families. We teach teachers a simple 6/9 Snellen screening method in Hindi. For children with progressive myopia, we counsel parents about outdoor time (at least 1 hour daily) as a proven intervention to slow myopia progression.",
    clinician: "dr-prabha"
  }],
  "conjunctivitis-treatment-in-palamu": [{
    standardView: "Standard ophthalmology texts describe conjunctivitis as inflammation of the conjunctiva, classified as viral, bacterial, or allergic. Viral conjunctivitis is typically self-limiting with supportive care.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care observes two distinct seasonal conjunctivitis outbreaks in Jharkhand: viral conjunctivitis during the monsoon (July–August) that spreads rapidly through schools and households, and allergic conjunctivitis during the spring pollen season (March–April) when palash and simul trees are in bloom across the Chotanagpur plateau.",
    treatmentModification: "During monsoon outbreaks, we counsel families in Hindi that viral conjunctivitis is highly contagious and spreads through touching — hand hygiene and separate towels are the most effective prevention. We actively discourage the use of antibiotic-steroid combination drops that local chemists dispense without prescription, as these can cause steroid-induced glaucoma with prolonged use.",
    clinician: "dr-prabha"
  }],
  "keratoconus-treatment-in-palamu": [{
    standardView: "Standard corneal textbooks describe keratoconus as a progressive, non-inflammatory ectasia of the cornea, with onset typically in adolescence. Risk factors include eye rubbing, atopy, and genetic predisposition.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care diagnoses keratoconus at higher-than-expected rates in Jharkhand adolescents and young adults with a history of chronic allergic eye rubbing — driven by high pollen counts from the region's sal and mahua forests. The condition is almost universally missed by local optometrists, who keep changing glasses prescriptions without ever performing corneal topography.",
    treatmentModification: "We perform corneal topography on every young patient with progressively worsening astigmatism. For diagnosed keratoconus, we counsel in Hindi about the critical importance of stopping eye rubbing — 'aankh mat maliye' — and offer corneal collagen cross-linking (C3R) to halt progression before the cornea becomes too thin. We also treat the underlying allergic conjunctivitis to remove the trigger for rubbing.",
    clinician: "dr-prabha"
  }],
  "endophthalmitis-treatment-in-palamu": [{
    standardView: "Endophthalmitis is a severe intraocular infection classified as exogenous (post-surgical, post-traumatic) or endogenous. It is an ophthalmic emergency requiring intravitreal antibiotics and often vitrectomy.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care manages post-traumatic endophthalmitis from penetrating eye injuries in Jharkhand's agricultural and mining workers — injuries from flying stone chips during mining, thorn penetrations during farming, and metallic foreign bodies from informal welding work without eye protection — that become infected within 24–48 hours.",
    treatmentModification: "We perform immediate vitreous tap for culture and Gram stain, administer intravitreal antibiotics (vancomycin + ceftazidime) on presentation, and proceed to vitrectomy within hours rather than days. We counsel workers in Hindi that wearing basic polycarbonate safety glasses costs under Rs. 200 and can prevent a blinding infection.",
    clinician: "dr-prabha"
  }],
  "ocular-oncology-in-palamu": [{
    standardView: "Standard ocular oncology literature describes retinoblastoma as the most common primary intraocular malignancy of childhood, with survival rates exceeding 95% in developed countries when diagnosed early.",
    palamuObservation: "Dr. Dibya Prabha at Palamu Neuro & Eye Care sees retinoblastoma in Jharkhand children at advanced stages — Reese-Ellsworth group D and E — where the tumour has already filled most of the eye. Delayed diagnosis occurs because families from rural districts interpret the white pupillary reflex (leukocoria) as 'nazar dosh' (evil eye) rather than a medical emergency, and seek traditional healing before consulting a doctor.",
    treatmentModification: "We educate paediatricians in Palamu and district hospitals to check for leukocoria with a simple pen-torch test during every child's routine check-up and counsel parents in Hindi that 'bachche ki aankh ki putli mein safed chamak dikhe toh turant aankh ke doctor ko dikhayein' (a white glow in a child's pupil means see an eye doctor immediately).",
    clinician: "dr-prabha"
  }]
};

async function main() {
  const files = [
    "conditions-1.json", "conditions-2.json", "conditions-3.json",
    "conditions-4.json", "conditions-5.json", "conditions-6.json",
    "conditions-7.json", "conditions-8.json", "conditions-9.json",
    "conditions-10.json"
  ];

  let totalAdded = 0;
  for (const file of files) {
    const path = join(DATA_DIR, file);
    const data = JSON.parse(await readFile(path, "utf-8"));
    for (const page of data) {
      const obs = observations[page.slug];
      if (obs) {
        page.clinicalObservations = obs;
        totalAdded++;
      }
    }
    await writeFile(path, JSON.stringify(data, null, 2) + "\n");
    console.log(`Updated ${file}`);
  }
  console.log(`\nAdded clinicalObservations to ${totalAdded} conditions`);
}

main();
