import numpy as np


def new_comment(time_stamp, video_id='ZK3O402wf1c', user_id=4, comment='Hello so confused!', video=1):
    return '''INSERT INTO timeStamps(videoId, userId, timeStamp, comment, addressedByTeacher, commentType, video)
    VALUES("%s", %i, %i, "%s", false, null, %i);''' % (video_id, user_id, time_stamp, comment, video)


# video duration in seconds
duration = 2389

X = np.genfromtxt('data/X.csv')
output = [new_comment(int(duration * x_i / 10)) for x_i in X]
f = open('dummy-schema.sql', 'w')
f.write('USE oneTeam;\n')
f.write('\n'.join(output))
