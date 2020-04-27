export class Patient {
  id;
  name;
  sex;
  birthday;
  telephone;
  reserveTelephone;
  address;
  province;
  city;
  area;
  projectId;
  incorporationDate;
  caseCount;
  followCount;
  age;
  visitDate;
  createdBy;
  lastModifiedDate;
}
export class PatientCase {
  id;
  content;
  state;
  projectId;
  patientId;
}
export class PatientTask {
  taskId;
  patient;
  cases;
}
export class PatientInfoPage {
  name = 'patient';
  title = '基本信息';
  elements = [
    {
      type: 'text',
      isRequired: true,
      name: 'name',
      title: '姓名',
      validators: [
        {
          type: 'text',
          maxLength: 50,
          minLength: 0
        }
      ]
    },
    {
      type: 'radiogroup',
      choices: [
        '男',
        '女'
      ],
      name: 'sex',
      title: '性别'
    },
    {
      type: 'text',
      name: 'birthday',
      title: '出生日期(yyyy-MM-dd)',
      validators: [
        {
          type: 'regex',
          regex: '^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$',
          text: '请输入正确的出生日期,示例:2018-01-01'
        }
      ]
    },
    {
      type: 'text',
      name: 'visitDate',
      title: '就诊日期(yyyy-MM-dd)',
      validators: [
        {
          type: 'regex',
          regex: '^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$',
          text: '请输入正确的就诊日期,示例:2018-01-01'
        }
      ]
    },
    {
      type: 'text',
      name: 'telephone',
      title: '电话',
      validators: [
        {
          type: 'regex',
          regex: '^1(3|4|5|7|8)\\d{9}$',
          text: '请输入正确的手机号码'
        }
      ]
    },
    {
      type: 'text',
      name: 'reserveTelephone',
      title: '备用电话',
      validators: [
        {
          type: 'regex',
          regex: '[\\(\\)\\d-]{7,20}',
          text: '请输入正确的电话号码'
        }
      ]
    },
    {
      type: 'address',
      name: 'address',
      title: '地址'
    }
  ];
}
