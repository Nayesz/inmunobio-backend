import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-finalizar-experimento',
  templateUrl: './finalizar-experimento.component.html',
  styleUrls: ['./finalizar-experimento.component.css']
})
export class FinalizarExperimentoComponent implements OnInit {
  formFinExp!: FormGroup;
  obj = {
    conclusion: '',
    resultados: '',
  };
  idExperimento!: number;
  idProyecto!: number;
  disabledForm: boolean;
  @Output() cerrar = new EventEmitter<any>();

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    public toastService: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.idExperimento = parseInt(this.activatedRouter.snapshot.paramMap.get('idExperimento'), 10);
    this.idProyecto = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);
    this.formFinExp = new FormGroup({
      conclusiones: new FormControl('', [Validators.required, Validators.maxLength(3000)]),
      resultados: new FormControl('', [Validators.required, Validators.maxLength(3000)])
    });

  }

  finalizarExperimento(): void {
    this.disabledForm = true;
    const finExp: any = {
      id_experimento: this.idExperimento,
      conclusiones: this.formFinExp.value.conclusiones,
      resultados: this.formFinExp.value.resultados
    };
    if (!this.formFinExp.invalid){
      this.postService.cerrarExperimento(finExp).subscribe(res => {
        this.toastService.show('Experimento finalizado', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.cerrarModal();
          this.toastService.removeAll()
          this.disabledForm = false;
          this.router.navigate(['/home/proyectos/' + this.idProyecto]);
        }, 2000);
        }, err => {
          this.toastService.show('Problema al finalizar experimento', { classname: 'bg-danger text-light', delay: 2000 });
          this.disabledForm = false;
          setTimeout(() => {
            this.toastService.removeAll()
            this.disabledForm = false;
          }, 2000);
      });
    }
    
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

}
