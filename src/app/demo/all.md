flowchart TD
Node_0(Doente > 18 anos com TCE)
Node_1(Contactar neurocirurgia)
Node_2(Monitorização intra-hospitalar)
Node_3(Observação em ambulatório)
Decision_1[Critérios para TAC-CE sem constraste 
- Escala de Coma de Glasgow < 15
- Défice neurológico focal
- Suspeita de fractura aberta/afundada
- Sinais de fractura da base do crânio
- Convulsões]
Decision_2[Critérios para avaliação por neurocirurgia 
- Efeito de massa
- Hematoma epidural ou subdural
- Contusão cerebral
- Hemorragia subaracnoideia extensa, fossa posterior, hemorragia intraventricular ou bilateral
- Fratura craniana deprimida ou diastásica
- Pneumocéfalo
- Edema cerebral ]
Decision_3[Critérios para observação intra-hospitalar 
- Escala de Coma de Glasgow < 15
- Coagulopatia ou anticoagulação
- Convulsão
- Nenhum cuidador responsável em casa]
Node_0 --> | | Decision_1
Decision_1 --> |Sim| Decision_2
Decision_1 --> |Não| Decision_3
Decision_2 --> |Sim| Node_1
Decision_2 --> |Não| Decision_3
Decision_3 --> |Sim| Node_2
Decision_3 --> |Não| Node_3