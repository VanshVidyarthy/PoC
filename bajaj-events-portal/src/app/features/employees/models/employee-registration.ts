
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from "@angular/forms";

export class EmployeeRegistration {
    employeeForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.employeeForm = this.formBuilder.group({
            employeeId: [0, Validators.required],
            employeeName: ['No Name', Validators.required],
            address: ['', [Validators.required, this.addressMinLengthValidator]],
            city: [''],
            zipcode: ['', [Validators.required, this.zipcodeExactLengthValidator]],
            phone: [''],
            email: ['', [Validators.required, this.domainEmailValidator]],
            skillSets: ['', [Validators.required, this.minimumSkillSetsValidator]],
            country: [''],
            avatar: [''],
            fees: [0, [Validators.min(0)]],
            seatsFilled: [0, [Validators.min(0), Validators.max(100)]],
        });
    }

    // Custom validator for address minimum 25 characters
    private addressMinLengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value && value.length < 25) {
            return { addressMinLength: { requiredLength: 25, actualLength: value.length } };
        }
        return null;
    }

    // Custom validator for zipcode exact 6 characters
    private zipcodeExactLengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value && value.length !== 6) {
            return { zipcodeExactLength: { requiredLength: 6, actualLength: value.length } };
        }
        return null;
    }

    // Custom validator for minimum 2 skill sets (comma separated)
    private minimumSkillSetsValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value) {
            const skillSets = value.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0);
            if (skillSets.length < 2) {
                return { minimumSkillSets: { requiredSkills: 2, actualSkills: skillSets.length } };
            }
        }
        return null;
    }

    // Custom validator for email with domain extension
    private domainEmailValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value) {
            // Check if email has @ and domain with extension
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(value)) {
                return { domainEmail: { message: 'Email must have @domain.extension format' } };
            }
        }
        return null;
    }
}
