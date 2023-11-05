flowchart TD
Node_0(Doente > 18 anos com TCE )
Node_1(Contactar neurocirurgia )
Node_2(Monitorização intra-hospitalar )
Node_3(Observação em ambulatório )
Decision_1[Critérios para TAC-CE sem constraste]
Decision_2[Critérios para avaliação por neurocirurgia]
Decision_3[Critérios para observação intra-hospitalar]
Node_0 --> | | Decision_1
Decision_1 --> |Sim| Decision_2
Decision_1 --> |Não| Decision_3
Decision_2 --> |Sim| Node_1
Decision_2 --> |Não| Decision_3
Decision_3 --> |Sim| Node_2
Decision_3 --> |Não| Node_3